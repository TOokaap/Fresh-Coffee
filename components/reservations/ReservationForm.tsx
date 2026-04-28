"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import type { CSSProperties } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { fr } from "date-fns/locale";
import { addDays, isSameDay, format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import {
    fetchBookedCoversPerSlot,
    fetchOccupiedTableIds,
    submitReservation,
} from "@/app/(public)/reservation/actions";
import { Separator } from "../ui/separator";

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface TimeRange {
    from: string;
    to: string;
}

interface OpeningHoursDTO {
    dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    isClosed: boolean;
    openingRanges: TimeRange[];
    bookableSlots: TimeRange[];
}

interface ReservationSettingsDTO {
    slotInterval: 15 | 30 | 60;
    maxCoversPerSlot: number;
    minNoticeHours: number;
    maxAdvanceDays: number;
    maxGuestsPerBooking: number;
    tableReservationEnabled: boolean;
    tableDuration: number;
}

type TableShape = "square" | "round" | "rectangle";

interface ZoneDTO {
    _id: string;
    name: string;
    gridCols: number;
    gridRows: number;
    order: number;
}

interface TableDTO {
    _id: string;
    name: string;
    shape: TableShape;
    minCapacity: number;
    maxCapacity: number;
    col: number;
    row: number;
    colSpan: number;
    rowSpan: number;
    zoneId: string;
}

interface BlockedSlotDTO {
    _id: string;
    type: "day" | "slot";
    date: string;
    time: string | null;
    timeFrom: string | null;
    timeTo: string | null;
    reason: string | null;
    blockType: "full" | "floor_plan_only";
}

interface ZoneClosureDTO {
    _id: string;
    zoneId: string | null;
    date: string;
    slotRanges: { from: string; to: string }[];
    reason: string | null;
}

// ─── Constantes grille ────────────────────────────────────────────────────────

const CHAIR_THICKNESS = 5;
const CHAIR_LENGTH = 12;
const CHAIR_GAP = 2;
const CLIENT_CELL = 56;

// ─── Génération des créneaux horaires ─────────────────────────────────────────

function getTimeSlots(
    date: Date,
    openingHours: OpeningHoursDTO[],
    slotInterval: number
): string[] {
    const dayOfWeek = date.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    const dayHours = openingHours.find((h) => h.dayOfWeek === dayOfWeek);
    if (!dayHours || dayHours.isClosed) return [];

    const ranges =
        dayHours.bookableSlots.length > 0
            ? dayHours.bookableSlots
            : dayHours.openingRanges;

    const slots: string[] = [];
    for (const range of ranges) {
        const [fromH, fromM] = range.from.split(":").map(Number);
        const [toH, toM] = range.to.split(":").map(Number);
        let current = fromH * 60 + fromM;
        const end = toH * 60 + toM;
        while (current < end) {
            const h = Math.floor(current / 60)
                .toString()
                .padStart(2, "0");
            const m = (current % 60).toString().padStart(2, "0");
            slots.push(`${h}:${m}`);
            current += slotInterval;
        }
    }
    return slots;
}

// ─── Positions des chaises autour d'une table ─────────────────────────────────

function getChairPositions(
    maxCapacity: number,
    colSpan: number,
    rowSpan: number
): CSSProperties[] {
    const tableW = colSpan * CLIENT_CELL - 6;
    const tableH = rowSpan * CLIENT_CELL - 6;

    const maxTop = colSpan,
        maxBottom = colSpan,
        maxLeft = rowSpan,
        maxRight = rowSpan;
    const counts = { top: 0, bottom: 0, left: 0, right: 0 };
    let remaining = maxCapacity;

    while (remaining > 0) {
        const before = remaining;
        if (counts.top < maxTop && remaining > 0) {
            counts.top++;
            remaining--;
        }
        if (counts.bottom < maxBottom && remaining > 0) {
            counts.bottom++;
            remaining--;
        }
        if (counts.left < maxLeft && remaining > 0) {
            counts.left++;
            remaining--;
        }
        if (counts.right < maxRight && remaining > 0) {
            counts.right++;
            remaining--;
        }
        if (remaining === before) break;
    }

    const chairs: CSSProperties[] = [];

    const placeH = (count: number, isTop: boolean) => {
        for (let i = 0; i < count; i++) {
            const x = (tableW / (count + 1)) * (i + 1) - CHAIR_LENGTH / 2;
            chairs.push({
                position: "absolute",
                width: CHAIR_LENGTH,
                height: CHAIR_THICKNESS,
                left: x,
                ...(isTop
                    ? {
                          top: -(CHAIR_THICKNESS + CHAIR_GAP),
                          borderRadius: "3px 3px 1px 1px",
                      }
                    : {
                          bottom: -(CHAIR_THICKNESS + CHAIR_GAP),
                          borderRadius: "1px 1px 3px 3px",
                      }),
            });
        }
    };

    const placeV = (count: number, isLeft: boolean) => {
        for (let i = 0; i < count; i++) {
            const y = (tableH / (count + 1)) * (i + 1) - CHAIR_LENGTH / 2;
            chairs.push({
                position: "absolute",
                width: CHAIR_THICKNESS,
                height: CHAIR_LENGTH,
                top: y,
                ...(isLeft
                    ? {
                          left: -(CHAIR_THICKNESS + CHAIR_GAP),
                          borderRadius: "3px 1px 1px 3px",
                      }
                    : {
                          right: -(CHAIR_THICKNESS + CHAIR_GAP),
                          borderRadius: "1px 3px 3px 1px",
                      }),
            });
        }
    };

    placeH(counts.top, true);
    placeH(counts.bottom, false);
    placeV(counts.left, true);
    placeV(counts.right, false);

    return chairs;
}

// ─── Rendu grille plan de salle (inline, pas de composant séparé) ─────────────

function renderFloorGrid({
    zone,
    tables,
    guests,
    occupiedTableIds,
    selectedTableId,
    onSelectTable,
    onDeselect,
}: {
    zone: ZoneDTO;
    tables: TableDTO[];
    guests: number;
    occupiedTableIds: string[];
    selectedTableId: string | null;
    onSelectTable: (id: string) => void;
    onDeselect: () => void;
}) {
    return (
        <div
            className="relative bg-muted/20 rounded-lg border inline-block"
            onClick={onDeselect}
        >
            <div
                className="grid"
                style={{
                    gridTemplateColumns: `repeat(${zone.gridCols}, ${CLIENT_CELL}px)`,
                    gridTemplateRows: `repeat(${zone.gridRows}, ${CLIENT_CELL}px)`,
                    width: zone.gridCols * CLIENT_CELL,
                    height: zone.gridRows * CLIENT_CELL,
                }}
            >
                {Array.from({ length: zone.gridRows * zone.gridCols }).map(
                    (_, i) => (
                        <div
                            key={i}
                            className="border border-dashed border-border/30"
                            style={{ width: CLIENT_CELL, height: CLIENT_CELL }}
                        />
                    )
                )}
            </div>

            <div className="absolute inset-0 pointer-events-none">
                {tables.map((table) => {
                    const isOccupied = occupiedTableIds.includes(table._id);
                    const isTooSmall = table.maxCapacity < guests;
                    const isUnderMin =
                        !isTooSmall && table.minCapacity > guests;
                    const isIdeal = !isOccupied && !isTooSmall && !isUnderMin;
                    const isSelected = table._id === selectedTableId;
                    const isSelectable = !isOccupied && !isTooSmall;

                    const capacityLabel =
                        table.minCapacity === table.maxCapacity
                            ? `${table.maxCapacity}p`
                            : `${table.minCapacity}–${table.maxCapacity}p`;

                    const tooltipText = isOccupied
                        ? "Table non disponible à ce créneau"
                        : isTooSmall
                        ? `Table prévue pour ${table.maxCapacity} personne${
                              table.maxCapacity > 1 ? "s" : ""
                          } max`
                        : isUnderMin
                        ? `Prévue pour ${table.minCapacity}+ personnes — sélectionnable quand même`
                        : undefined;

                    const chairs = getChairPositions(
                        table.maxCapacity,
                        table.colSpan,
                        table.rowSpan
                    );

                    return (
                        <div
                            key={table._id}
                            className="absolute pointer-events-auto"
                            style={{
                                left: table.col * CLIENT_CELL,
                                top: table.row * CLIENT_CELL,
                                width: table.colSpan * CLIENT_CELL,
                                height: table.rowSpan * CLIENT_CELL,
                                padding: 3,
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <TooltipProvider delayDuration={300}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div
                                            style={{
                                                position: "relative",
                                                overflow: "visible",
                                                width: "100%",
                                                height: "100%",
                                            }}
                                            onClick={
                                                isSelectable
                                                    ? () =>
                                                          onSelectTable(
                                                              table._id
                                                          )
                                                    : undefined
                                            }
                                            className={
                                                isSelectable
                                                    ? "cursor-pointer"
                                                    : undefined
                                            }
                                        >
                                            {chairs.map((style, i) => (
                                                <div
                                                    key={i}
                                                    className={cn(
                                                        isSelected
                                                            ? "bg-primary/40"
                                                            : isOccupied
                                                            ? "bg-red-300/50 dark:bg-red-800/50"
                                                            : isTooSmall
                                                            ? "bg-muted-foreground/15"
                                                            : "bg-muted-foreground/35"
                                                    )}
                                                    style={style}
                                                />
                                            ))}
                                            <div
                                                className={cn(
                                                    "w-full h-full flex flex-col items-center justify-center text-xs font-medium border-2 select-none transition-colors",
                                                    table.shape === "round"
                                                        ? "rounded-full"
                                                        : "rounded-md",
                                                    isSelected
                                                        ? "bg-primary text-primary-foreground border-primary"
                                                        : isOccupied
                                                        ? "bg-red-100 dark:bg-red-950 border-red-300 dark:border-red-800 text-red-500 dark:text-red-400"
                                                        : isTooSmall
                                                        ? "bg-muted border-border text-muted-foreground opacity-40 cursor-not-allowed"
                                                        : isUnderMin
                                                        ? "bg-card border-amber-300 dark:border-amber-700 hover:border-amber-400 hover:bg-amber-50/30 dark:hover:bg-amber-950/20"
                                                        : isIdeal
                                                        ? "bg-green-50/60 dark:bg-green-950/30 border-green-400 dark:border-green-700 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/50"
                                                        : "bg-card border-border hover:border-primary/60 hover:bg-primary/5"
                                                )}
                                            >
                                                <span className="truncate max-w-[90%] px-1 text-center leading-tight">
                                                    {table.name}
                                                </span>
                                                <span
                                                    className={cn(
                                                        "text-[10px]",
                                                        isSelected
                                                            ? "opacity-80"
                                                            : "opacity-50"
                                                    )}
                                                >
                                                    {isOccupied
                                                        ? "Occupée"
                                                        : capacityLabel}
                                                </span>
                                            </div>
                                        </div>
                                    </TooltipTrigger>
                                    {tooltipText && (
                                        <TooltipContent>
                                            {tooltipText}
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Formulaire principal ─────────────────────────────────────────────────────

export default function ReservationForm({
    openingHours,
    reservationSettings,
    blockedSlots,
    zones = [],
    tablesByZone = {},
    zoneClosures = [],
}: {
    openingHours: OpeningHoursDTO[];
    reservationSettings: ReservationSettingsDTO;
    blockedSlots: BlockedSlotDTO[];
    zones?: ZoneDTO[];
    tablesByZone?: Record<string, TableDTO[]>;
    zoneClosures?: ZoneClosureDTO[];
}) {
    const [date, setDate] = useState<Date | undefined>();
    const [time, setTime] = useState<string | null>(null);
    const [guests, setGuests] = useState(2);
    const [bookedCovers, setBookedCovers] = useState<Record<string, number>>(
        {}
    );
    const [tableId, setTableId] = useState<string | null>(null);
    const [occupiedTableIds, setOccupiedTableIds] = useState<string[]>([]);
    const [isLoadingTables, setIsLoadingTables] = useState(false);
    const tableRequestRef = useRef(0);

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
    });
    const [mounted, setMounted] = useState(false);

    const [activeZoneId, setActiveZoneId] = useState<string>(
        zones[0]?._id ?? ""
    );
    const activeZone = zones.find((z) => z._id === activeZoneId);
    const activeTables = tablesByZone[activeZoneId] ?? [];

    useEffect(() => {
        setMounted(true);
    }, []);

    // Resélectionner une zone ouverte si la zone active est fermée sur ce créneau
    useEffect(() => {
        if (!date || !time) return;
        if (isZoneClosedAtTime(activeZoneId)) {
            const open = zones.find((z) => !isZoneClosedAtTime(z._id));
            if (open) setActiveZoneId(open._id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date, time, zoneClosures]);

    // Fetch tables occupées quand date+créneau changent
    useEffect(() => {
        setTableId(null);
        setOccupiedTableIds([]);
        if (!date || !time || !reservationSettings.tableReservationEnabled)
            return;

        const requestId = ++tableRequestRef.current;
        setIsLoadingTables(true);

        fetchOccupiedTableIds(
            date.toISOString(),
            time,
            reservationSettings.tableDuration
        ).then((ids) => {
            if (requestId !== tableRequestRef.current) return;
            setOccupiedTableIds(ids);
            setIsLoadingTables(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date, time]);

    // Réinitialise la table si elle devient trop petite pour le groupe
    useEffect(() => {
        if (!tableId) return;
        const allTables = Object.values(tablesByZone).flat();
        const selected = allTables.find((t) => t._id === tableId);
        if (selected && selected.maxCapacity < guests) setTableId(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [guests]);

    // ─── Fermetures restaurant ──────────────────────────────────────────────

    function isFullyClosed(d: Date): boolean {
        return zoneClosures.some(
            (c) =>
                c.zoneId === null &&
                isSameDay(new Date(c.date), d) &&
                c.slotRanges.length === 0
        );
    }

    function isSlotClosed(d: Date, t: string): boolean {
        const closure = zoneClosures.find(
            (c) => c.zoneId === null && isSameDay(new Date(c.date), d)
        );
        if (!closure) return false;
        if (closure.slotRanges.length === 0) return true;
        return closure.slotRanges.some((r) => r.from <= t && t < r.to);
    }

    function getZoneClosureLabel(zoneId: string): string | null {
        if (!date || !time) return null;
        const closure = zoneClosures.find(
            (c) => c.zoneId === zoneId && isSameDay(new Date(c.date), date)
        );
        if (!closure) return null;
        if (closure.slotRanges.length === 0) return "Fermée ce jour";
        const range = closure.slotRanges.find(
            (r) => r.from <= time && time < r.to
        );
        if (!range) return null;
        const fmt = (t: string) => t.replace(":00", "h").replace(":", "h");
        return `Fermée de ${fmt(range.from)} à ${fmt(range.to)}`;
    }

    function isZoneClosedAtTime(zoneId: string): boolean {
        return getZoneClosureLabel(zoneId) !== null;
    }

    // ─── Créneaux disponibles ───────────────────────────────────────────────

    const closedDays = openingHours
        .filter((h) => h.isClosed)
        .map((h) => h.dayOfWeek);

    const allSlots = date
        ? getTimeSlots(date, openingHours, reservationSettings.slotInterval)
        : [];

    const slots = allSlots.filter((slot) => {
        if (!date) return false;
        const [h, m] = slot.split(":").map(Number);
        const slotDate = new Date(date);
        slotDate.setHours(h, m, 0, 0);
        const minDate = new Date(
            Date.now() + reservationSettings.minNoticeHours * 60 * 60 * 1000
        );
        if (slotDate < minDate) return false;
        return !isSlotClosed(date, slot);
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = addDays(today, reservationSettings.maxAdvanceDays);
    const isOverGuestLimit = guests > reservationSettings.maxGuestsPerBooking;

    // ─── Plan de salle ──────────────────────────────────────────────────────

    const isFloorPlanBlockedForSlot = useMemo(() => {
        if (!date || !time) return false;
        return blockedSlots.some((s) => {
            if (s.blockType !== "floor_plan_only") return false;
            if (!isSameDay(new Date(s.date), date)) return false;
            if (s.time === time) return true;
            if (s.timeFrom && s.timeTo)
                return s.timeFrom <= time && time < s.timeTo;
            return false;
        });
    }, [blockedSlots, date, time]);

    const floorPlanEnabled =
        reservationSettings.tableReservationEnabled &&
        zones.length > 0 &&
        !isFloorPlanBlockedForSlot;

    function isZoneComplete(zoneId: string): boolean {
        const tables = tablesByZone[zoneId] ?? [];
        if (tables.length === 0) return true;
        return tables.every(
            (t) => occupiedTableIds.includes(t._id) || t.maxCapacity < guests
        );
    }

    // ─── Handlers ──────────────────────────────────────────────────────────

    async function handleDateSelect(selected: Date | undefined) {
        setDate(selected);
        setTime(null);
        setTableId(null);
        setOccupiedTableIds([]);
        setActiveZoneId(zones[0]?._id ?? "");
        if (selected) {
            const covers = await fetchBookedCoversPerSlot(
                selected.toISOString()
            );
            setBookedCovers(covers);
        } else {
            setBookedCovers({});
        }
    }

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!date || !time) return;

        try {
            await submitReservation({
                ...form,
                date: date.toISOString(),
                time,
                guests,
                tableIds: tableId ? [tableId] : [],
            });
            toast.success(
                "Veuillez confirmer votre demande de réservation en cliquant sur le lien dans le mail reçu."
            );
        } catch (error) {
            console.error(error);
            toast.error("Une erreur est survenue. Veuillez réessayer.");
        }
    }

    // ─── Rendu ──────────────────────────────────────────────────────────────

    return (
        <main className="bg-background min-h-screen flex flex-col items-center w-full overflow-x-hidden">
            <section className="py-12 md:py-20">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-title mt-15 md:mt-20 mb-6">
                        Réservation
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto font-body">
                        Assurez-vous d'avoir votre place préférée pour un moment
                        de détente. Que ce soit pour un espresso rapide ou un
                        brunch prolongé, nous vous préparons une table avec
                        soin.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-6">
                <Separator />
            </div>

            <section className="py-10 md:py-16 w-full px-6 max-w-5xl">
                <form
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col gap-20"
                >
                    {/* Étape 1 — Date + Créneau + Couverts */}
                    <div className="w-full flex flex-col lg:flex-row justify-center gap-8 lg:gap-20">
                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-semibold">
                                Choisissez une date
                            </h2>
                            {mounted && (
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={handleDateSelect}
                                    locale={fr}
                                    disabled={(d) =>
                                        closedDays.includes(
                                            d.getDay() as
                                                | 0
                                                | 1
                                                | 2
                                                | 3
                                                | 4
                                                | 5
                                                | 6
                                        ) ||
                                        d < today ||
                                        d > maxDate ||
                                        isFullyClosed(d)
                                    }
                                    className="rounded-xl border w-fit"
                                />
                            )}
                        </div>

                        <div className="flex flex-col gap-4 justify-between w-full lg:max-w-md">
                            {date && (
                                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <h2 className="text-xl font-semibold">
                                        Choisissez un créneau
                                        <span className="text-muted-foreground text-base font-normal ml-2">
                                            —{" "}
                                            {format(date, "EEEE d MMMM", {
                                                locale: fr,
                                            })}
                                        </span>
                                    </h2>
                                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                        {slots.map((slot) => {
                                            const booked =
                                                bookedCovers[slot] ?? 0;
                                            const isFull =
                                                booked >=
                                                reservationSettings.maxCoversPerSlot;
                                            return (
                                                <button
                                                    key={slot}
                                                    type="button"
                                                    onClick={() =>
                                                        !isFull && setTime(slot)
                                                    }
                                                    disabled={isFull}
                                                    className={cn(
                                                        "py-2 px-3 rounded-lg border text-sm font-medium transition-colors",
                                                        isFull
                                                            ? "opacity-40 cursor-not-allowed bg-muted text-muted-foreground border-border"
                                                            : time === slot
                                                            ? "bg-primary text-primary-foreground border-primary cursor-pointer"
                                                            : "bg-background hover:bg-muted border-border cursor-pointer"
                                                    )}
                                                >
                                                    {slot}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {time && (
                                <div className="flex flex-col gap-4 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <h2 className="text-xl font-semibold">
                                        Nombre de personnes
                                    </h2>
                                    <div className="flex items-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setGuests((g) =>
                                                    Math.max(1, g - 1)
                                                )
                                            }
                                            className="w-10 h-10 rounded-lg border flex items-center justify-center text-lg hover:bg-muted transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="text-2xl font-semibold w-8 text-center">
                                            {guests}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setGuests((g) => g + 1)
                                            }
                                            className="w-10 h-10 rounded-lg border flex items-center justify-center text-lg hover:bg-muted transition-colors"
                                        >
                                            +
                                        </button>
                                        {isOverGuestLimit && (
                                            <p className="text-sm text-amber-600">
                                                Pour les groupes de plus de{" "}
                                                {
                                                    reservationSettings.maxGuestsPerBooking
                                                }{" "}
                                                personnes, merci d'appeler le
                                                restaurant pour réserver.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Étape 2 — Plan de salle (optionnel) */}
                    {floorPlanEnabled && time && !isOverGuestLimit && (
                        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <h2 className="text-xl font-semibold">
                                Choisissez une table
                                <span className="text-muted-foreground text-base font-normal ml-2">
                                    — optionnel
                                </span>
                            </h2>

                            {/* Onglets zones (uniquement si plusieurs zones) */}
                            {zones.length > 1 && (
                                <div className="flex items-center gap-2 flex-wrap">
                                    {zones.map((zone) => {
                                        const isDisabled = isZoneClosedAtTime(
                                            zone._id
                                        );
                                        const closureLabel =
                                            getZoneClosureLabel(zone._id);
                                        const isComplete =
                                            !isDisabled &&
                                            isZoneComplete(zone._id);
                                        const isActiveTab =
                                            zone._id === activeZoneId;

                                        return (
                                            <button
                                                key={zone._id}
                                                type="button"
                                                disabled={isDisabled}
                                                onClick={() =>
                                                    !isDisabled &&
                                                    setActiveZoneId(zone._id)
                                                }
                                                className={cn(
                                                    "flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-medium transition-colors",
                                                    isActiveTab && !isDisabled
                                                        ? "bg-primary text-primary-foreground border-primary"
                                                        : isDisabled
                                                        ? "opacity-50 cursor-not-allowed bg-muted border-border text-muted-foreground"
                                                        : "bg-background hover:bg-muted border-border text-muted-foreground"
                                                )}
                                            >
                                                {zone.name}
                                                {isDisabled && closureLabel && (
                                                    <span className="text-[10px] opacity-70">
                                                        {closureLabel}
                                                    </span>
                                                )}
                                                {isComplete && (
                                                    <span className="text-[10px] bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-full">
                                                        Complet
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Légende */}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-sm bg-green-50 dark:bg-green-950/30 border-2 border-green-400 dark:border-green-700 inline-block" />
                                    Idéale pour votre groupe
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-sm bg-card border-2 border-border inline-block" />
                                    Disponible
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-sm bg-card border-2 border-amber-300 dark:border-amber-700 inline-block" />
                                    Capacité indicative
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-sm bg-primary inline-block" />
                                    Sélectionnée
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-sm bg-red-100 dark:bg-red-950 border border-red-300 inline-block" />
                                    Occupée
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-sm bg-muted border border-border opacity-40 inline-block" />
                                    Trop petite
                                </span>
                            </div>

                            {/* Grille */}
                            {activeZone && (
                                <div className="relative w-full overflow-hidden">
                                    {isLoadingTables ? (
                                        <div
                                            className="rounded-lg border bg-muted/30 animate-pulse"
                                            style={{
                                                width: Math.min(
                                                    activeZone.gridCols *
                                                        CLIENT_CELL,
                                                    400
                                                ),
                                                height: Math.min(
                                                    activeZone.gridRows *
                                                        CLIENT_CELL,
                                                    300
                                                ),
                                            }}
                                        />
                                    ) : isZoneComplete(activeZoneId) ? (
                                        <div
                                            className="rounded-lg border bg-muted/30 flex flex-col items-center justify-center gap-2 py-12 px-8 text-center"
                                            style={{
                                                minWidth: Math.min(
                                                    activeZone.gridCols *
                                                        CLIENT_CELL,
                                                    500
                                                ),
                                            }}
                                        >
                                            <p className="font-medium text-sm">
                                                Ce créneau est complet
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Toutes les tables sont réservées
                                                pour {time}.<br />
                                                Essayez un autre créneau ou une
                                                autre date.
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="overflow-x-auto max-w-full pb-3 rounded-lg">
                                                {renderFloorGrid({
                                                    zone: activeZone,
                                                    tables: activeTables,
                                                    guests,
                                                    occupiedTableIds,
                                                    selectedTableId: tableId,
                                                    onSelectTable: (id) =>
                                                        setTableId((prev) =>
                                                            prev === id
                                                                ? null
                                                                : id
                                                        ),
                                                    onDeselect: () =>
                                                        setTableId(null),
                                                })}
                                            </div>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent rounded-r-lg sm:hidden" />
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Résumé sélection table */}
                            <p className="text-sm text-muted-foreground">
                                {tableId ? (
                                    <>
                                        Table sélectionnée :{" "}
                                        <strong className="text-foreground">
                                            {
                                                activeTables.find(
                                                    (t) => t._id === tableId
                                                )?.name
                                            }
                                        </strong>{" "}
                                        <button
                                            type="button"
                                            onClick={() => setTableId(null)}
                                            className="underline hover:text-foreground"
                                        >
                                            Annuler
                                        </button>
                                    </>
                                ) : (
                                    "Aucune table sélectionnée — vous pouvez continuer sans choisir."
                                )}
                            </p>
                        </div>
                    )}

                    {/* Étape 3 — Informations personnelles */}
                    {time && (
                        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <h2 className="text-xl font-semibold">
                                Vos informations
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="firstName">Prénom</Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        value={form.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="lastName">Nom</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        value={form.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="phone">Téléphone</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={form.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2 sm:col-span-2">
                                    <Label htmlFor="message">
                                        Message (optionnel)
                                    </Label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        placeholder="Allergies, occasion spéciale..."
                                        value={form.message}
                                        onChange={handleChange}
                                        rows={3}
                                    />
                                </div>
                            </div>

                            {/* Récapitulatif */}
                            <div className="rounded-lg border bg-muted/40 p-4">
                                <p className="text-sm font-medium mb-3">
                                    Récapitulatif
                                </p>
                                <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
                                    <dt className="text-muted-foreground">
                                        Date
                                    </dt>
                                    <dd className="font-medium">
                                        {format(date!, "EEEE d MMMM yyyy", {
                                            locale: fr,
                                        })}
                                    </dd>
                                    <dt className="text-muted-foreground">
                                        Créneau
                                    </dt>
                                    <dd className="font-medium">{time}</dd>
                                    <dt className="text-muted-foreground">
                                        Personnes
                                    </dt>
                                    <dd className="font-medium">
                                        {guests} personne{guests > 1 ? "s" : ""}
                                    </dd>
                                    {floorPlanEnabled &&
                                        tableId &&
                                        (() => {
                                            const selectedTable = Object.values(
                                                tablesByZone
                                            )
                                                .flat()
                                                .find((t) => t._id === tableId);
                                            const selectedZone = zones.find(
                                                (z) =>
                                                    tablesByZone[z._id]?.some(
                                                        (t) => t._id === tableId
                                                    )
                                            );
                                            return (
                                                <>
                                                    <dt className="text-muted-foreground">
                                                        Table
                                                    </dt>
                                                    <dd className="font-medium">
                                                        {selectedTable?.name}
                                                        {selectedZone &&
                                                            zones.length >
                                                                1 && (
                                                                <span className="text-muted-foreground font-normal">
                                                                    {" "}
                                                                    ·{" "}
                                                                    {
                                                                        selectedZone.name
                                                                    }
                                                                </span>
                                                            )}
                                                    </dd>
                                                </>
                                            );
                                        })()}
                                </dl>
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full sm:w-fit"
                                disabled={isOverGuestLimit}
                            >
                                Demander une réservation
                            </Button>
                        </div>
                    )}
                </form>
            </section>
        </main>
    );
}

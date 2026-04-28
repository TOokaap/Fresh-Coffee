"use server";

import ReservationForm from "@/components/reservations/ReservationForm";

import {
    getBlockedSlots,
    getOpeningHours,
    getReservationSettings,
    getTablesByZone,
    getZoneClosures,
    getZones,
    getEtablissement,
} from "@/lib/api";
import { redirect } from "next/navigation";

export default async function TestReservationPage() {
    const etablissement = await getEtablissement();
    if (!etablissement.features.reservations) redirect("/");
    const [openingHours, reservationSettings, blockedSlots, zoneClosures] =
        await Promise.all([
            getOpeningHours(),
            getReservationSettings(),
            getBlockedSlots(),
            getZoneClosures(),
        ]);

    let zones: {
        _id: string;
        name: string;
        gridCols: number;
        gridRows: number;
        order: number;
    }[] = [];

    let tablesByZone: Record<
        string,
        {
            _id: string;
            name: string;
            shape: "square" | "round" | "rectangle";
            minCapacity: number;
            maxCapacity: number;
            col: number;
            row: number;
            colSpan: number;
            rowSpan: number;
            zoneId: string;
        }[]
    > = {};

    if (reservationSettings.tableReservationEnabled) {
        const allZones = await getZones();
        zones = allZones
            .filter((z) => z.isActive)
            .map(({ _id, name, gridCols, gridRows, order }) => ({
                _id,
                name,
                gridCols,
                gridRows,
                order,
            }));

        const entries = await Promise.all(
            zones.map(async (z) => {
                const tables = await getTablesByZone(z._id);
                return [
                    z._id,
                    tables
                        .filter((t) => t.isActive)
                        .map(
                            ({
                                _id,
                                name,
                                shape,
                                minCapacity,
                                maxCapacity,
                                col,
                                row,
                                colSpan,
                                rowSpan,
                                zoneId,
                            }) => ({
                                _id,
                                name,
                                shape: shape as
                                    | "square"
                                    | "round"
                                    | "rectangle",
                                minCapacity,
                                maxCapacity,
                                col,
                                row,
                                colSpan,
                                rowSpan,
                                zoneId,
                            })
                        ),
                ] as const;
            })
        );
        tablesByZone = Object.fromEntries(entries);
    }

    return (
        <ReservationForm
            openingHours={openingHours.map(
                ({ dayOfWeek, isClosed, openingRanges, bookableSlots }) => ({
                    dayOfWeek,
                    isClosed,
                    openingRanges,
                    bookableSlots,
                })
            )}
            reservationSettings={{
                slotInterval: reservationSettings.slotInterval,
                maxCoversPerSlot: reservationSettings.maxCoversPerSlot,
                minNoticeHours: reservationSettings.minNoticeHours,
                maxAdvanceDays: reservationSettings.maxAdvanceDays,
                maxGuestsPerBooking: reservationSettings.maxGuestsPerBooking,
                tableReservationEnabled:
                    reservationSettings.tableReservationEnabled,
                tableDuration: reservationSettings.tableDuration,
            }}
            blockedSlots={blockedSlots.map((s) => ({
                _id: s._id,
                type: s.type,
                date: s.date,
                time: s.time ?? null,
                timeFrom: s.timeFrom ?? null,
                timeTo: s.timeTo ?? null,
                reason: s.reason ?? null,
                blockType: s.blockType,
            }))}
            zones={zones}
            tablesByZone={tablesByZone}
            zoneClosures={zoneClosures.map((c) => ({
                _id: c._id,
                zoneId: c.zoneId,
                date: c.date,
                slotRanges: c.slotRanges,
                reason: c.reason ?? null,
            }))}
        />
    );
}

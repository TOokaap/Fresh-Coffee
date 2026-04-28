import { CategoryItem } from "./types/category";
import { IEtablissement } from "./types/etablissement";
import { IEvent } from "./types/events";
import { photoItem } from "./types/gallery";
import { LabelGroup } from "./types/label.type";
import { menuItem } from "./types/menu";
import { newsItem } from "./types/news.type";
import { ReservationFormData } from "./types/reservationFormData.type";
import { ISiteConfig } from "./types/siteConfig.type";

// lib/api.ts  (projet public)
const BASE = process.env.DASHBOARD_API_URL;
const KEY = process.env.API_KEY;

async function apiFetch<T>(
    path: string,
    params?: Record<string, string>,
    init?: RequestInit
): Promise<T> {
    const url = new URL(`${BASE}/api/v1${path}`);
    if (params) {
        Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    }

    const res = await fetch(url.toString(), {
        headers: {
            Authorization: `Bearer ${KEY}`,
            "Content-Type": "application/json",
        },
        ...init,
        next: { revalidate: 60, tags: [path], ...(init as any)?.next },
    });

    if (!res.ok) throw new Error(`API error ${res.status}`);
    return res.json();
}

// export const getMenu = (category?: string) =>
//     apiFetch<MenuItem[]>("/menu", category ? { category } : undefined);

//SiteConfig
export const getSiteConfig = () => apiFetch<ISiteConfig>("/site-config");

//Etablissement
export const getEtablissement = () =>
    apiFetch<IEtablissement>("/etablissement");

//Menu
export const getMenu = (params?: {
    category?: string;
    subCategory?: string;
    search?: string;
}) => apiFetch<menuItem[]>("/menu", params as Record<string, string>);

export const getItemFeatured = () =>
    apiFetch<menuItem | null>("/menu/item-featured");

//Catégorie
export const getCategories = () => apiFetch<CategoryItem[]>("/category");

//label
export const getLabels = () => apiFetch<LabelGroup[]>("/labels");

//Gallery
export const getPhotos = (status?: string) =>
    apiFetch<photoItem[]>("/gallery", status ? { status } : undefined);

//Events
export const getEvents = () => apiFetch<IEvent[]>("/events");

export const getEventBySlug = (slug: string) =>
    apiFetch<IEvent>(`/events/${slug}`);

//News
export const getNews = (status?: string) =>
    apiFetch<newsItem[]>("/news", status ? { status } : undefined);

export const getNewsBySlug = (slug: string) =>
    apiFetch<newsItem>(`/news/${slug}`);

// Horaires
export const getOpeningHours = () => apiFetch<OpeningHoursDTO[]>("/hours");

// Paramètres de réservation
export const getReservationSettings = () =>
    apiFetch<ReservationSettingsDTO>("/reservation-settings");

// Zones actives du plan de salle
export const getZones = () => apiFetch<ZoneDTO[]>("/zones");

// Tables d'une zone
export const getTablesByZone = (zoneId: string) =>
    apiFetch<TableDTO[]>(`/zones/${zoneId}/tables`);

export const getOccupiedTableIds = (
    date: string,
    time: string,
    duration?: number
) =>
    apiFetch<string[]>("/reservations/occupied-tables", {
        date,
        time,
        ...(duration ? { duration: String(duration) } : {}),
    });

// Créneaux bloqués
export const getBlockedSlots = () =>
    apiFetch<BlockedSlotDTO[]>("/blocked-slots");

// Fermetures de zones
export const getZoneClosures = () =>
    apiFetch<ZoneClosureDTO[]>("/zone-closures");

//Couverts
export const getBookedCoversPerSlot = (date: string) =>
    apiFetch<Record<string, number>>("/reservations/covers", { date });

//Réservation
export const createReservation = (data: ReservationFormData) =>
    apiFetch<{ success: boolean }>("/reservations", undefined, {
        method: "POST",
        body: JSON.stringify(data),
    });

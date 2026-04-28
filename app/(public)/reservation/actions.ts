"use server";

import {
    createReservation,
    getBookedCoversPerSlot,
    getOccupiedTableIds,
} from "@/lib/api";
import { ReservationFormData } from "@/lib/types/reservationFormData.type";

export async function fetchBookedCoversPerSlot(date: string) {
    return getBookedCoversPerSlot(date);
}

export async function fetchOccupiedTableIds(
    date: string,
    time: string,
    duration?: number
) {
    return getOccupiedTableIds(date, time, duration);
}

export async function submitReservation(data: ReservationFormData) {
    return createReservation(data);
}

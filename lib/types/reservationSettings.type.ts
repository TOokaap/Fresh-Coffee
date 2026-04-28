interface ReservationSettingsDTO {
    slotInterval: 15 | 30 | 60;
    maxCoversPerSlot: number;
    minNoticeHours: number;
    maxAdvanceDays: number;
    maxGuestsPerBooking: number;
    floorPlanEnabled: boolean;
    tableReservationEnabled: boolean;
    tableDuration: number;
}

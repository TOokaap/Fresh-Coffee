function slotsFromRanges(
    ranges: { from: string; to: string }[],
    slotInterval: number
): string[] {
    const slots: string[] = [];
    for (const range of ranges) {
        const [startHour, startMin] = range.from.split(":").map(Number);
        const [endHour, endMin] = range.to.split(":").map(Number);
        let h = startHour;
        let m = startMin;
        while (h < endHour || (h === endHour && m < endMin)) {
            slots.push(
                `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
            );
            m += slotInterval;
            if (m >= 60) {
                m -= 60;
                h++;
            }
        }
    }
    return slots;
}

export function getTimeSlots(
    date: Date,
    openingHours: OpeningHoursDTO[],
    slotInterval: 15 | 30 | 60 = 30
): string[] {
    const day = date.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    const dayConfig = openingHours.find((h) => h.dayOfWeek === day);

    if (!dayConfig || dayConfig.isClosed) return [];

    // Plages réservables en priorité, sinon plages d'ouverture
    const ranges =
        dayConfig.bookableSlots.length > 0
            ? dayConfig.bookableSlots
            : dayConfig.openingRanges;

    return slotsFromRanges(ranges, slotInterval);
}

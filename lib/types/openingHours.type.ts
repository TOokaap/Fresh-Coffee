export interface TimeRange {
    from: string;
    to: string;
}
export interface OpeningHoursDTO {
    dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    isClosed: boolean;
    openingRanges: TimeRange[];
    bookableSlots: TimeRange[];
}

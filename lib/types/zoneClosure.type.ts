interface SlotRange {
    from: string;
    to: string;
}
interface ZoneClosureDTO {
    _id: string;
    zoneId: string | null;
    date: string;
    slotRanges: SlotRange[];
    reason: string | null;
}

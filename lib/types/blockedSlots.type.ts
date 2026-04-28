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

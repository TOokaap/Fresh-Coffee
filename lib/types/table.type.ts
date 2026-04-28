type TableShape = "square" | "round" | "rectangle";
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
    isActive: boolean;
}

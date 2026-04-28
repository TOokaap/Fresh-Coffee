export interface IEvent {
    _id: string;
    title: string;
    slug: string;
    description: string;
    shortDescription: string;
    date: Date;
    startTime: string;
    endTime?: string;
    location: string;
    urlImage: string;
    price: number;
    capacity?: number;
    status: "draft" | "published" | "cancelled" | "completed";
    category: "workshop" | "music" | "tasting" | "community";
    isFull: boolean;
    createdAt: Date;
    updatedAt: Date;
}

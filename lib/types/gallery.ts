export type photoItem = {
    _id: any;
    title: string;
    alt: string;
    urlImage: string;
    status: "draft" | "published";
    createdAt: Date;
    updatedAt: Date;
};

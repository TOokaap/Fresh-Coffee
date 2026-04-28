export type newsItem = {
    _id: any;
    title: string;
    slug: string;
    description: string;
    content: string;
    urlImage?: string;
    status: "draft" | "published" | "archived";
    category: string;
    tags?: string[];
    author: {
        name: string;
    };

    publishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
};

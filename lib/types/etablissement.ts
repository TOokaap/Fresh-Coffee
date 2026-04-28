export interface ISocialLinks {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    tripadvisor?: string;
    thefork?: string;
}

export interface IFeatures {
    menu: boolean;
    events: boolean;
    news: boolean;
    gallery: boolean;
    reservations: boolean;
}

export interface IEtablissement extends Document {
    name: string;
    address: string;
    mapEmbedUrl?: string;
    phone: string;
    email: string;
    description?: string;
    socialLinks: ISocialLinks;
    features: IFeatures;
    createdAt: Date;
    updatedAt: Date;
}

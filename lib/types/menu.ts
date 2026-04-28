import mongoose from "mongoose";

type menuType = "barista" | "cuisine";

interface InterfacePublicData {
    title: string;
    price: number;
    description?: string;
    allergenes: mongoose.Types.ObjectId[];
    labels: mongoose.Types.ObjectId[];
    isFeatured: boolean;
    urlPhoto: string;
    order: number;
}

export interface menuItem extends Document {
    _id: any;
    category: any;
    title: string;
    description?: string;
    price: number;
    isAvailable: boolean;
    urlPhoto: string;
    allergenes: any[];
    labels: any[];
    publicData?: InterfacePublicData;
    hasPendingChanges: boolean;
    isPublished: boolean;
    isFeatured: boolean;
    order: number;
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
    BadgeCheck,
    Bean,
    CircleDot,
    Drumstick,
    Egg,
    Fish,
    GlassWater,
    Leaf,
    Medal,
    Nut,
    Shell,
    Wheat,
} from "lucide-react";
import { CategoryItem } from "./types/category";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Fonctions utilitaires pour les allergènes

const specificIcons: Record<string, any> = {
    Gluten: Wheat,
    Arachides: Bean,
    Noix: Nut,
    Sésame: CircleDot,
    Crustacé: Shell,
    Poisson: Fish,
    Oeuf: Egg,
    Mollusque: Shell,
    Volaille: Drumstick,
    Soja: Bean,
    Céleri: Leaf,
    Moutarde: GlassWater,
};

// Icônes de secours basées sur la catégorie
const fallbackCategoryIcons: Record<string, any> = {
    cereale: Wheat,
    nutFruit: Nut,
    originAnimal: Fish,
    divers: Bean,
};

// Logique hybride pour l'icône
export const getIconAllergene = (id: string, category: string) => {
    return specificIcons[id] || fallbackCategoryIcons[category] || Bean;
};

//Fin allergènes

//Liés au label
// Icônes de secours basées sur la catégorie
const categoryIcons: Record<string, any> = {
    diet: Leaf,
    quality: Medal,
    marketing: BadgeCheck,
};

// Logique hybride pour l'icône
export const getIconLabel = (id: string, category: string) => {
    return categoryIcons[category] || Bean;
};

export type BadgeVariant =
    | "default"
    | "draft"
    | "published"
    | "archived"
    | "secondary"
    | "outline";

export const getVariant = (status: string): BadgeVariant => {
    if (status === "published") return "published";
    if (status === "draft") return "draft";
    if (status === "archived") return "archived";
    return "default";
};

export const getStatus = (status: string) => {
    if (status === "published") {
        return "Publié";
    } else if (status === "draft") {
        return "Brouillon";
    } else {
        return "Archivé";
    }
};

//Events
export const getStatusEvent = (status: string) => {
    if (status === "published") {
        return "Publié";
    } else if (status === "draft") {
        return "Brouillon";
    } else if (status === "cancelled") {
        return "Annulé";
    } else {
        return "Terminé";
    }
};

export const getEventStatus: Record<
    string,
    { label: string; className: string }
> = {
    published: {
        label: "Publié",
        className: "bg-green-500/90 hover:bg-green-500 text-white",
    },
    draft: {
        label: "Brouillon",
        className: "bg-amber-500/90 hover:bg-amber-500 text-white",
    },
    cancelled: {
        label: "Annulé",
        className: "bg-red-500/90 hover:bg-red-500 text-white",
    },
    completed: {
        label: "Terminé",
        className: "bg-blue-500/90 hover:bg-blue-500 text-white",
    },
};

export const buildCategoryTree = (categories: CategoryItem[]) => {
    const map = new Map();
    const tree: any[] = [];

    // On prépare la map
    categories.forEach((cat) =>
        map.set(cat._id.toString(), { ...cat, children: [] })
    );

    // On construit l'arborescence
    categories.forEach((cat) => {
        if (cat.parent) {
            const parent = map.get(cat.parent.toString());
            if (parent) parent.children.push(map.get(cat._id.toString()));
        } else {
            tree.push(map.get(cat._id.toString()));
        }
    });

    return tree;
};

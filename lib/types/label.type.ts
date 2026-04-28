export interface LabelItem {
    _id: string;
    label: string; // ex: "Vegan"
    slug: string; // ex: "vegan"
    color: string; // ex: "#10b981" (vert)
    icon?: string; // nom de l'icône Lucide ou Tabler (ex: "Leaf")
    category: "diet" | "quality" | "marketing"; // Pour trier : Régime, Qualité, Marketing
    isFilterable: boolean;
}

export interface LabelGroup {
    category: "diet" | "quality" | "marketing";
    label: string; // Nom affichable de la catégorie
    items: LabelItem[];
}

export type LabelList = {
    label: string; // Le nom affiché (ex: "Fruits à coques")
    category: string; // L'identifiant (ex: "nutFruit")
    items: LabelItem[]; // Les allergènes de cette catégorie
};

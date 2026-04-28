export interface CategoryItem {
    _id: string;
    name: string;
    description?: string;
    slug: string;
    parent: string | null;
    children?: CategoryItem[];
    order: number;
    isActive: boolean;
    isFormula: boolean;
    price?: number;
}

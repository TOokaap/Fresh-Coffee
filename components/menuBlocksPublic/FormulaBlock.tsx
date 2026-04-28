// components/menuBlocksPublic/FormulaBlock.tsx

import { getIconAllergene, getIconLabel } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { CategoryItem } from "@/lib/types/category";
import { menuItem } from "@/lib/types/menu";

export default function FormulaBlock({
    cat,
    menuItemsFiltered,
}: {
    cat: CategoryItem;
    menuItemsFiltered: menuItem[];
}) {
    const hasItemsInParent = menuItemsFiltered.some(
        (item: menuItem) => item.category?._id.toString() === cat._id.toString()
    );
    const hasItemsInChildren = cat.children?.some((subCat: CategoryItem) =>
        menuItemsFiltered.some(
            (item: menuItem) =>
                item.category?._id.toString() === subCat._id.toString()
        )
    );

    // if (!hasItemsInParent && !hasItemsInChildren) return null;

    return (
        <div className="w-full min-h-fit">
            {/* EN-TÊTE — même style que CategoryBlock */}
            <div className="flex flex-col items-center mb-12 space-y-4">
                <h2 className="text-6xl font-title text-secondary-foreground text-center">
                    {cat.name}
                </h2>
                <span className="text-primary/60 text-xs tracking-[0.4em] uppercase font-medium">
                    {cat.description}
                </span>
                <div className="h-0.5 w-24 bg-primary/20 rounded-full" />

                {/* Prix de la formule */}
                {cat.price && (
                    <div className="flex items-baseline gap-1.5 mt-2">
                        <span className="text-4xl font-title text-primary">
                            {cat.price.toFixed(2)}
                        </span>
                        <span className="text-xl text-primary/70 font-medium">
                            €
                        </span>
                    </div>
                )}
            </div>

            {/* CONTENU — encadré pour distinguer visuellement d'une catégorie normale */}
            <div className="border-2 border-primary/50 rounded-2xl p-8 bg-white/50 max-w-3xl mx-auto space-y-8">
                {/* Items directs sur la formule (sans sous-catégorie) */}
                {hasItemsInParent && (
                    <div className="space-y-3">
                        {menuItemsFiltered
                            .filter(
                                (item: menuItem) =>
                                    item.category?._id.toString() ===
                                    cat._id.toString()
                            )
                            .map((item: menuItem) => (
                                //Ici on peut lister les différentes ofres de la formule
                                <div
                                    key={item._id}
                                    className="group flex flex-col gap-1 py-2 rounded-xl cursor-default transition-all duration-300 hover:bg-primary/5"
                                >
                                    <div className="flex items-baseline justify-between gap-2">
                                        <h4 className="text-3xl font-semibold text-primary/80 font-title group-hover:text-primary transition-colors">
                                            {item.title}
                                            {!item.isAvailable && (
                                                <span className="text-xs text-muted-foreground italic ml-3">
                                                    (Bientôt disponible)
                                                </span>
                                            )}
                                        </h4>
                                        <span className="text-2xl font-title text-primary">
                                            {item.price !== 0 &&
                                                `${item.price.toFixed(
                                                    2
                                                )}€`}{" "}
                                        </span>
                                    </div>

                                    {item.description && (
                                        <p className="text-sm text-muted-foreground italic">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                    </div>
                )}

                {/* Séparateur si on a les deux */}
                {hasItemsInParent && hasItemsInChildren && (
                    <div className="h-px bg-primary/10" />
                )}

                {/* Sous-catégories = les "cours" de la formule (Entrée, Plat, Dessert...) */}
                {cat.children
                    ?.filter((subCat: CategoryItem) => subCat.isActive)
                    .map((subCat: CategoryItem) => {
                        const subCatItems = menuItemsFiltered.filter(
                            (item: menuItem) =>
                                item.category?._id.toString() ===
                                subCat._id.toString()
                        );
                        if (subCatItems.length === 0) return null;

                        return (
                            <div
                                key={subCat._id.toString()}
                                className="space-y-3"
                            >
                                {/* Titre du cours */}
                                <div className="flex items-center gap-3">
                                    <h3 className="text-3xl font-title font-bold text-primary/80">
                                        {subCat.name}
                                    </h3>
                                    <div className="flex-1 h-px bg-primary/10" />
                                </div>
                                {subCat.description && (
                                    <p className="text-xs text-muted-foreground italic -mt-2">
                                        {subCat.description}
                                    </p>
                                )}

                                {/* Items du cours */}
                                <div className="space-y-2">
                                    {subCatItems.map((item: menuItem) => (
                                        <FormulaItem
                                            key={item._id.toString()}
                                            item={item}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

// Composant item — sans prix individuel
function FormulaItem({ item }: { item: menuItem }) {
    return (
        <div className="group flex flex-col gap-1 py-2 px-4 rounded-xl cursor-default transition-all duration-300 hover:bg-primary/5">
            <div className="flex items-baseline justify-between gap-2">
                <h4 className="text-lg font-semibold text-foreground/90 group-hover:text-primary transition-colors">
                    {item.title}
                    {!item.isAvailable && (
                        <span className="text-xs text-muted-foreground italic ml-3">
                            (Bientôt disponible)
                        </span>
                    )}
                </h4>
                {/* Labels */}
                {item.labels && item.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {item.labels.map((label) => {
                            const Icon = getIconLabel(
                                label._id,
                                label.category
                            );
                            return (
                                <Badge
                                    key={label._id?.toString() || label.label}
                                    variant="secondary"
                                    className="text-[12px] px-2 py-0 h-5 bg-primary/5 text-primary border-none"
                                >
                                    <Icon size={12} />
                                    {label.label}
                                </Badge>
                            );
                        })}
                    </div>
                )}
            </div>

            {item.description && (
                <p className="text-sm text-muted-foreground italic">
                    {item.description}
                </p>
            )}

            {/* Allergènes au hover */}
            {item.allergenes && item.allergenes.length > 0 && (
                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 opacity-0 group-hover:opacity-100">
                    <div className="overflow-hidden">
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground/50">
                                Allergènes :
                            </span>
                            <div className="flex flex-wrap gap-1">
                                {item.allergenes.map((allergene) => {
                                    const Icon = getIconAllergene(
                                        allergene._id,
                                        allergene.category
                                    );
                                    return (
                                        <Badge
                                            key={
                                                allergene._id?.toString() ||
                                                allergene.label
                                            }
                                            variant="secondary"
                                            className="text-[12px] px-2 py-0 h-5 bg-primary/5 border border-primary text-primary"
                                        >
                                            <Icon
                                                size={16}
                                                className="text-primary"
                                            />
                                            {allergene.label}
                                        </Badge>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

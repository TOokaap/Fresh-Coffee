import { getIconAllergene, getIconLabel } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { CategoryItem } from "@/lib/types/category";
import { menuItem } from "@/lib/types/menu";

export default function CategoryBlock({
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

    if (!hasItemsInParent && !hasItemsInChildren) return null;

    return (
        <div className="w-full min-h-fit">
            {/* EN-TÊTE CATÉGORIE PARENTE (Prend toute la largeur) */}
            <div className="flex flex-col items-center mb-16 space-y-4">
                <h2 className="text-6xl font-title text-secondary-foreground text-center">
                    {cat.name}
                </h2>
                <span className="text-primary/60 text-xs tracking-[0.4em] uppercase font-medium">
                    {cat.description}
                </span>
                <div className="h-0.5 w-24 bg-primary/20 rounded-full" />
            </div>
            {/* Si on a des items liés directement à des catégories parentes */}
            {menuItemsFiltered
                .filter(
                    (item: menuItem) =>
                        item.category?._id.toString() === cat._id.toString()
                )
                .map((item: menuItem) => (
                    <div
                        key={item._id.toString()}
                        className="group flex flex-col gap-1"
                    >
                        <div className="flex justify-between items-baseline gap-2">
                            <h4 className="text-lg font-semibold text-foreground/90 group-hover:text-primary transition-colors">
                                {item.title}
                            </h4>
                            <span className="flex-1 border-b border-dotted border-muted-foreground/30 mx-2 mb-1" />
                            <span className="text-lg font-medium text-secondary-foreground">
                                {item.price.toFixed(2)} €
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed italic pr-12">
                            {item.description}
                        </p>
                    </div>
                ))}

            {/* GRILLE DES SOUS-CATÉGORIES (2 colonnes) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20 max-w-7xl mx-auto px-4">
                {cat.children
                    ?.filter((cat: CategoryItem) => cat.isActive === true)
                    .map((subCat: CategoryItem) => {
                        // 3. On filtre les items pour CETTE sous-catégorie
                        const subCatItems = menuItemsFiltered.filter(
                            (item: menuItem) =>
                                item.category?._id.toString() ===
                                subCat._id.toString()
                        );

                        // Si la sous-catégorie est vide à cause du filtre, on l'ignore
                        if (subCatItems.length === 0) return null;

                        return (
                            <div
                                key={subCat._id.toString()}
                                className="flex flex-col"
                            >
                                {/* TITRE SOUS-CATÉGORIE - Aligné à gauche pour le côté cosy/traditionnel */}
                                <div className="flex flex-col gap-4 mb-8">
                                    <h3 className="text-4xl font-title font-bold text-primary/80 whitespace-nowrap">
                                        {subCat.name}
                                    </h3>
                                    <div className="w-40 h-1 rounded-full bg-accent" />
                                </div>

                                {/* LISTE DES PRODUITS (Verticale dans chaque colonne) */}
                                <div className="">
                                    {menuItemsFiltered
                                        .filter(
                                            (item: menuItem) =>
                                                item.category?._id.toString() ===
                                                subCat._id.toString()
                                        )
                                        .map((item: menuItem) => (
                                            // PRODUIT
                                            <div
                                                key={item._id.toString()}
                                                className="group animate-in flex flex-col gap-1 py-4 px-6 rounded-2xl cursor-default transition-all duration-300 ease-in-out hover:scale-105 hover:bg-white border border-transparent hover:border-primary/20 hover:shadow-lg"
                                            >
                                                {/* Ligne Titre et Prix */}
                                                <div className="flex justify-between items-baseline gap-2">
                                                    <h4 className="text-lg font-semibold text-foreground/90 group-hover:text-primary transition-colors">
                                                        {item.title}
                                                        <span className="text-xs text-muted-foreground italic ml-4">
                                                            {!item.isAvailable &&
                                                                "( Bientôt disponible )"}
                                                        </span>
                                                    </h4>
                                                    <span className="flex-1 border-b border-dotted border-muted-foreground/30 mx-2 mb-1" />
                                                    <span className="text-lg font-medium text-secondary-foreground">
                                                        {item.price.toFixed(2)}{" "}
                                                        €
                                                    </span>
                                                </div>

                                                <div className="pr-4">
                                                    {/* Description */}

                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm text-muted-foreground italic">
                                                            {item.description}
                                                        </p>
                                                        <div>
                                                            {item?.labels &&
                                                                item.labels
                                                                    .length >
                                                                    0 && (
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                        {item.labels.map(
                                                                            (
                                                                                label
                                                                            ) => {
                                                                                const Icon =
                                                                                    getIconLabel(
                                                                                        label._id,
                                                                                        label.category
                                                                                    );
                                                                                return (
                                                                                    <Badge
                                                                                        key={
                                                                                            label._id?.toString() ||
                                                                                            label.label
                                                                                        }
                                                                                        variant="secondary"
                                                                                        className="text-[12px] px-2 py-0 h-5 bg-primary/5 text-primary border-none"
                                                                                    >
                                                                                        <Icon
                                                                                            size={
                                                                                                12
                                                                                            }
                                                                                        />
                                                                                        {
                                                                                            label.label
                                                                                        }
                                                                                    </Badge>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </div>

                                                    {/* Section interactive : S'affiche au survol du parent (group-hover) */}
                                                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100">
                                                        <div className="overflow-hidden">
                                                            {/* Affichage des Labels */}
                                                            {item?.labels &&
                                                                item.labels
                                                                    .length >
                                                                    0 && (
                                                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                                                        {item.labels.map(
                                                                            (
                                                                                label
                                                                            ) => {
                                                                                const Icon =
                                                                                    getIconLabel(
                                                                                        label._id,
                                                                                        label.category
                                                                                    );
                                                                                return (
                                                                                    <Badge
                                                                                        key={
                                                                                            label._id?.toString() ||
                                                                                            label.label
                                                                                        }
                                                                                        variant="secondary"
                                                                                        className="text-[12px] px-2 py-0 h-5 bg-primary/5 text-primary border-none"
                                                                                    >
                                                                                        <Icon
                                                                                            size={
                                                                                                12
                                                                                            }
                                                                                        />
                                                                                        {
                                                                                            label.label
                                                                                        }
                                                                                    </Badge>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </div>
                                                                )}

                                                            {/* Affichage des Allergènes */}
                                                            {item?.allergenes &&
                                                                item.allergenes
                                                                    .length >
                                                                    0 && (
                                                                    <div className="mt-2 flex items-center gap-2">
                                                                        <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground/50">
                                                                            Allergènes
                                                                            :
                                                                        </span>
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {item.allergenes.map(
                                                                                (
                                                                                    allergene
                                                                                ) => {
                                                                                    const Icon =
                                                                                        getIconAllergene(
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
                                                                                                size={
                                                                                                    16
                                                                                                }
                                                                                                className="text-primary"
                                                                                            />
                                                                                            {
                                                                                                allergene.label
                                                                                            }
                                                                                        </Badge>
                                                                                    );
                                                                                }
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

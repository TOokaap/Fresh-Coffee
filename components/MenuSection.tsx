"use server";

import { getCategories } from "@/app/actions/category";
import { getMenu, getMenuBarista, getMenuCuisine } from "@/app/actions/menu";
import { CategoryItem } from "@/lib/models/category.schema";
import { menuItem } from "@/lib/models/menu.schema";
import { IconCircleCheck } from "@tabler/icons-react";
import { Coffee, Croissant, Leaf, Pizza } from "lucide-react";
import { MenuBadgesFilter } from "./menuSectionPublic/MenuBadgesFilter";
import { getLabels } from "@/app/actions/labels";
import { Badge } from "./ui/badge";

export default async function MenuSectionTest({
    searchParams,
}: {
    searchParams: Promise<{ preview?: string; menu?: string; sub?: string }>;
}) {
    const { preview, menu, sub } = await searchParams;
    const isPreview = preview === "true";

    const menuItems = await getMenu(menu, sub, isPreview);

    console.log(menuItems);

    //On passe false car on veut que les catégories actives
    const categoriesData = await getCategories(false);

    const categories = categoriesData.categoryTree;

    const labelsData = await getLabels();

    const labels = labelsData.labels;

    return (
        <section id="menu" className="py-24 bg-background">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Header du Menu */}
                <div className="text-center mb-20 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-title">
                        Notre Carte <span className="text-primary">Maison</span>
                    </h1>
                    <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
                </div>
                {/* <MenuBadgesFilter labels={labels} /> */}

                {/* Grille du Menu */}
                <div className="flex flex-col gap-24">
                    {" "}
                    {/* Changement de flex-row à flex-col pour les parents */}
                    {categories
                        ?.filter((cat) => cat.isActive === true)
                        .map((cat) => (
                            <div
                                key={cat._id.toString()}
                                className="w-full min-h-fit"
                            >
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
                                {menuItems
                                    .filter(
                                        (item: menuItem) =>
                                            item.category?._id.toString() ===
                                            cat._id.toString()
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
                                        ?.filter(
                                            (cat: CategoryItem) =>
                                                cat.isActive === true
                                        )
                                        .map((subCat: CategoryItem) => (
                                            <div
                                                key={subCat._id.toString()}
                                                className="flex flex-col"
                                            >
                                                {/* TITRE SOUS-CATÉGORIE - Aligné à gauche pour le côté cosy/traditionnel */}
                                                <div className="flex flex-col gap-4 mb-8">
                                                    <h3 className="text-3xl font-title font-bold italic text-primary/80 whitespace-nowrap">
                                                        {subCat.name}
                                                    </h3>
                                                    <div className="w-40 h-1 rounded-full bg-accent mb-5" />
                                                </div>

                                                {/* LISTE DES PRODUITS (Verticale dans chaque colonne) */}
                                                <div className="space-y-10">
                                                    {menuItems
                                                        .filter(
                                                            (item: menuItem) =>
                                                                item.category?._id.toString() ===
                                                                subCat._id.toString()
                                                        )
                                                        .map(
                                                            (
                                                                item: menuItem
                                                            ) => (
                                                                // PRODUIT
                                                                <div
                                                                    key={item._id.toString()}
                                                                    className="group flex flex-col gap-1 py-3 px-5 rounded-2xl cursor-default hover:scale-110 hover:bg-white border-1 border-white hover:border-primary hover:shadow-2xl duration-200"
                                                                >
                                                                    <div className="flex justify-between items-baseline gap-2">
                                                                        <h4 className="text-lg font-semibold text-foreground/90 group-hover:text-primary transition-colors">
                                                                            {
                                                                                item.title
                                                                            }
                                                                        </h4>
                                                                        <span className="flex-1 border-b border-dotted border-muted-foreground/30 mx-2 mb-1" />
                                                                        <span className="text-lg font-medium text-secondary-foreground">
                                                                            {item.price.toFixed(
                                                                                2
                                                                            )}{" "}
                                                                            €
                                                                        </span>
                                                                    </div>

                                                                    <div className="pr-12">
                                                                        <div>
                                                                            <p className="text-sm text-muted-foreground leading-relaxed italic inline">
                                                                                {
                                                                                    item.description
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                        {item?.labels &&
                                                                            item
                                                                                .labels
                                                                                .length >
                                                                                0 && (
                                                                                <div className="flex flex-wrap gap-2 mt-2">
                                                                                    {item.labels.map(
                                                                                        (
                                                                                            label
                                                                                        ) => (
                                                                                            <Badge
                                                                                                key={
                                                                                                    label._id?.toString() ||
                                                                                                    label.label
                                                                                                }
                                                                                                variant="outline"
                                                                                            >
                                                                                                {
                                                                                                    label.label
                                                                                                }
                                                                                            </Badge>
                                                                                        )
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </section>
    );
}

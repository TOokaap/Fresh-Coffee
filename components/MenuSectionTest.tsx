"use client";

import { Leaf } from "lucide-react";
import { MenuBadgesFilter } from "./menuSectionPublic/MenuBadgesFilter";
import React, { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import CategoryBlock from "./menuBlocksPublic/CategoryBlock";
import FormulaBlock from "./menuBlocksPublic/FormulaBlock";
import { menuItem } from "@/lib/types/menu";
import { LabelList } from "@/lib/types/label.type";
import { CategoryItem } from "@/lib/types/category";

export default function MenuSectionTest({
    menuItems,
    categories,
    labels,
}: {
    menuItems: menuItem[];
    categories?: CategoryItem[];
    labels: LabelList[];
}) {
    // const { preview, menu, sub, filter } = await searchParams;
    // const isPreview = preview === "true";

    // //On groupe les requêtes pour les envoyer en même temps
    // const [menuItems, categoriesData, labelsData] = await Promise.all([
    //     // getMenu(menu, sub, isPreview, ""),
    //     getMenu("all", "all", isPreview, ""), //Test
    //     getCategories(false),
    //     getLabelsPublic(),
    // ]);

    // const categories = categoriesData.categoryTree;

    // const labels = labelsData.labels;

    // const menuItemsFiltered =
    //     filter && filter !== ""
    //         ? menuItems.filter((item: menuItem) =>
    //               item.labels?.some((label) => label.slug === filter)
    //           )
    //         : menuItems;

    const searchParams = useSearchParams();

    // 1. Initialisation : On lit l'URL une seule fois au montage du composant
    const [activeFilter, setActiveFilter] = useState<string | null>(
        searchParams.get("filter") || null
    );
    ///test
    // 2. Filtrage : On utilise useMemo pour ne pas recalculer à chaque micro-rendu
    const menuItemsFiltered = useMemo(() => {
        return menuItems.filter(
            (item) =>
                !activeFilter ||
                item.labels?.some((l) => l.slug === activeFilter)
        );
    }, [activeFilter, menuItems]);

    if (!menuItems || menuItems.length === 0) {
        return (
            <section
                id="menu"
                className="py-24 pt-40 bg-background min-h-screen"
            >
                <div className="mx-auto px-6 max-w-7xl">
                    {/* Header du Menu */}
                    <div className="text-center mb-20 space-y-4">
                        <h1 className="text-4xl md:text-5xl font-title">
                            Notre Carte{" "}
                            <span className="text-primary">Maison</span>
                        </h1>

                        <p className="text-muted-foreground font-body max-w-sm mx-auto">
                            Notre carte est en cours de préparation. Revenez
                            bientôt pour découvrir nos créations.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="menu" className="py-24 pt-40 bg-background">
            <div className="mx-auto px-6 max-w-7xl">
                {/* Header du Menu */}
                <div className="text-center mb-20 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-title">
                        Notre Carte <span className="text-primary">Maison</span>
                    </h1>
                </div>
                <MenuBadgesFilter
                    labels={labels}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                />

                {menuItemsFiltered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in">
                        <div className="bg-primary/5 p-6 rounded-full mb-6">
                            <Leaf className="w-12 h-12 text-primary/40" />
                        </div>
                        <h3 className="text-2xl font-title text-secondary-foreground mb-2">
                            Aucun plat ne correspond à ce critère
                        </h3>
                        <p className="text-muted-foreground max-w-md mb-8 italic">
                            Nos chefs préparent régulièrement de nouvelles
                            recettes. Essayez un autre filtre ou parcourez
                            l'ensemble de notre carte Maison !
                        </p>

                        {/* Bouton pour réinitialiser (Lien vers la page sans paramètre filter) */}
                        <a
                            href="/menu" // Assure-toi d'avoir importé pathname ou d'utiliser une URL propre
                            className="px-8 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20 font-medium"
                        >
                            Voir toute la carte
                        </a>
                    </div>
                ) : (
                    // Menu
                    <div className="flex flex-col gap-24">
                        {/* Changement de flex-row à flex-col pour les parents */}
                        {categories
                            ?.filter((cat) => cat.isActive === true)
                            .map((cat) => {
                                //Je fais ma comparaison de isFormulda ici

                                //Si aucun item est parésent dans la catégorie, on affiche pas la catégorie
                                return (
                                    <React.Fragment key={cat._id.toString()}>
                                        {cat.isFormula ? (
                                            <FormulaBlock
                                                cat={cat}
                                                menuItemsFiltered={
                                                    menuItemsFiltered
                                                }
                                            />
                                        ) : (
                                            <CategoryBlock
                                                cat={cat}
                                                menuItemsFiltered={
                                                    menuItemsFiltered
                                                }
                                            />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                    </div>
                )}
            </div>
        </section>
    );
}

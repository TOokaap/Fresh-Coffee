import MenuSectionTest from "@/components/MenuSectionTest";
import { getCategories, getEtablissement, getLabels, getMenu } from "@/lib/api";
import { redirect } from "next/navigation";

export const revalidate = 300;

export default async function page({
    searchParams,
}: {
    searchParams: Promise<{
        preview?: string;
        menu?: string;
        sub?: string;
        filter?: string;
    }>;
}) {
    const etablissement = await getEtablissement();
    if (!etablissement.features.menu) redirect("/");

    const { preview, menu, sub, filter } = await searchParams;
    const isPreview = preview === "true";

    //On groupe les requêtes pour les envoyer en même temps
    const [menuItems, categoriesData, labelsData] = await Promise.all([
        // getMenu(menu, sub, isPreview, ""),
        getMenu(), //Test
        getCategories(),
        getLabels(),
    ]);

    // const categories =
    //     categoriesData.categoryTree && categoriesData.categoryTree;

    // const labels = labelsData.labels;

    return (
        <MenuSectionTest
            menuItems={menuItems}
            categories={categoriesData}
            labels={labelsData}
        />
    );
}

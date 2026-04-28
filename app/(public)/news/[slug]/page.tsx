import NewsDetail from "@/components/news/NewsDetail";
import { getEtablissement, getNewsBySlug } from "@/lib/api";
import { notFound, redirect } from "next/navigation";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
    const etablissement = await getEtablissement();
    if (!etablissement.features.news) redirect("/");

    const { slug } = await params;

    console.log(slug);

    const article = await getNewsBySlug(slug);

    if (!article) {
        notFound();
    }

    return <NewsDetail article={article} />;
}

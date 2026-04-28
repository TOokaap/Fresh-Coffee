"use server";

import NewsSection from "@/components/news/NewsSection";
import { getEtablissement, getNews } from "@/lib/api";
import { redirect } from "next/navigation";

export default async function page() {
    const etablissement = await getEtablissement();
    if (!etablissement.features.news) redirect("/");

    const news = await getNews("published");

    return <NewsSection news={news} />;
}

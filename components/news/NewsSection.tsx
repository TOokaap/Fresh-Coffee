import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, User } from "lucide-react";
import { Separator } from "../ui/separator";
import { newsItem } from "@/lib/types/news.type";

export default function NewsSection({ news }: { news: newsItem[] }) {
    // 1. Logique de répartition des articles
    const featuredArticle = news[0]; // Le plus récent
    const sideArticles = news.slice(1, 4); // Les 3 suivants
    const remainingArticles = news.slice(4); // Tout le reste

    // Fonction utilitaire pour le temps de lecture (basé sur 200 mots/min)
    const getReadTime = (text: string) => {
        const words = text.split(/\s+/).length;
        const time = Math.ceil(words / 200);
        return `${time} min de lecture`;
    };

    // Formatage de date propre
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    if (!news || news.length === 0) {
        return (
            <div className="py-20 text-center">
                Aucun article disponible pour le moment.
            </div>
        );
    }

    return (
        <main className="bg-background min-h-screen flex flex-col items-center">
            {/* SECTION HERO */}
            <section id="news" className="py-12 md:py-20">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-title mt-15 md:mt-20 mb-6">
                        Actualités &{" "}
                        <span className="text-primary">Artisanat</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto font-body">
                        Plongez dans les coulisses de FreshCoffee : nos nouveaux
                        crus, nos secrets de torréfaction et les événements de
                        la communauté.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-6">
                <Separator />
            </div>

            <section className=" py-10 md:py-16">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* 1. ARTICLE À LA UNE */}
                        {featuredArticle && (
                            <Link
                                href={`/news/${featuredArticle.slug}`}
                                className="md:col-span-2 group"
                            >
                                <article className="cursor-pointer">
                                    <div className="relative overflow-hidden rounded-[var(--radius)] aspect-[16/9] mb-6 border">
                                        <Image
                                            src={
                                                featuredArticle.urlImage ||
                                                "/assets/placeholder-news.jpg"
                                            }
                                            fill
                                            alt={featuredArticle.title}
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-full">
                                            À la Une
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground font-body">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={14} />{" "}
                                                {formatDate(
                                                    featuredArticle.publishedAt ||
                                                        featuredArticle.createdAt
                                                )}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={14} />{" "}
                                                {getReadTime(
                                                    featuredArticle.content
                                                )}
                                            </span>
                                            <span className="flex items-center gap-1 uppercase font-bold text-primary">
                                                {featuredArticle.category}
                                            </span>
                                        </div>
                                        <h2 className="text-3xl font-title group-hover:text-primary transition-colors leading-tight">
                                            {featuredArticle.title}
                                        </h2>
                                        <p className="text-muted-foreground line-clamp-3 font-body">
                                            {featuredArticle.description}
                                        </p>
                                        <div className="inline-flex items-center gap-2 font-bold text-sm uppercase tracking-wider group-hover:gap-4 transition-all">
                                            Lire la suite{" "}
                                            <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        )}

                        {/* 2. BARRE LATÉRALE */}
                        <div className="space-y-12">
                            <h3 className="text-xl font-title border-b pb-4">
                                Dernières pépites
                            </h3>
                            <div className="space-y-8">
                                {sideArticles.map((item) => (
                                    <Link
                                        key={item.slug}
                                        href={`/news/${item.slug}`}
                                        className="group block"
                                    >
                                        <article className="flex gap-4">
                                            <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-[var(--radius)] border">
                                                <Image
                                                    src={
                                                        item.urlImage ||
                                                        "/assets/placeholder-news.jpg"
                                                    }
                                                    fill
                                                    alt={item.title}
                                                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="space-y-1 flex-1">
                                                <h4 className="font-title text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                                    {item.title}
                                                </h4>
                                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-semibold">
                                                    <span>{item.category}</span>
                                                    <span>•</span>
                                                    <span>
                                                        {formatDate(
                                                            item.createdAt
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 3. RESTE DE LA GRILLE */}
                    {remainingArticles.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20 border-t pt-20">
                            {remainingArticles.map((item) => (
                                <Link
                                    key={item.slug}
                                    href={`/news/${item.slug}`}
                                    className="group block"
                                >
                                    <article>
                                        <div className="relative aspect-[4/3] mb-6 overflow-hidden rounded-[var(--radius)] border">
                                            <Image
                                                src={
                                                    item.urlImage ||
                                                    "/assets/placeholder-news.jpg"
                                                }
                                                fill
                                                alt={item.title}
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                                                {item.category}
                                            </span>
                                            <h3 className="text-xl font-title group-hover:text-primary transition-colors line-clamp-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2 font-body">
                                                {item.description}
                                            </p>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

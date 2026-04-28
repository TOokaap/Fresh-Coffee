import React from "react";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown"; // Importation ici
import { Calendar, Clock, ArrowLeft, User, Share2 } from "lucide-react";
import { newsItem } from "@/lib/models/news.schema";
import { Button } from "../ui/button";

export default function NewsDetail({ article }: { article: newsItem }) {
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <article className="bg-background min-h-screen pb-20">
            {/* 1. HEADER */}
            <header className="pt-12 pb-8">
                <div className="container mx-auto px-6 max-w-4xl">
                    <Link
                        href="/news"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
                    >
                        <ArrowLeft
                            size={16}
                            className="group-hover:-translate-x-1 transition-transform"
                        />
                        Retour au journal
                    </Link>

                    <div className="space-y-4">
                        <span className="text-primary font-bold uppercase tracking-widest text-xs">
                            {article.category}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-title leading-tight">
                            {article.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 pt-4 text-muted-foreground text-sm border-b pb-8">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <User size={14} />
                                </div>
                                <span className="font-medium text-foreground">
                                    {article.author.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                {formatDate(
                                    article.publishedAt || article.createdAt
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={16} />5 min de lecture
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* 2. IMAGE PRINCIPALE */}
            <div className="container mx-auto px-6 max-w-5xl mb-12">
                <div className="relative aspect-[21/9] rounded-[var(--radius)] overflow-hidden border shadow-xl">
                    <Image
                        src={article.urlImage || "/assets/placeholder-news.jpg"}
                        fill
                        alt={article.title}
                        className="object-cover"
                        priority
                    />
                </div>
            </div>

            {/* 3. CONTENU */}
            <div className="container mx-auto px-6 max-w-3xl">
                <p className="text-xl text-muted-foreground font-body leading-relaxed mb-10 italic border-l-4 border-primary pl-6">
                    {article.description}
                </p>

                {/* Utilisation de ReactMarkdown avec Tailwind Typography */}
                <div
                    className="prose prose-stone lg:prose-xl max-w-none 
                    prose-headings:font-title prose-headings:font-bold 
                    prose-p:font-body prose-p:leading-relaxed 
                    prose-img:rounded-[var(--radius)]
                    prose-strong:text-foreground
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    prose-blockquote:border-primary prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:pr-4"
                >
                    <ReactMarkdown>{article.content}</ReactMarkdown>
                </div>

                {/* Tags & Partage */}
                <footer className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-wrap gap-2">
                        {article.tags?.map((tag) => (
                            <span
                                key={tag}
                                className="px-3 py-1 bg-muted rounded-full text-xs font-medium"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>

                    <Button variant="outline" size="sm" className="gap-2">
                        <Share2 size={16} /> Partager l'article
                    </Button>
                </footer>
            </div>
        </article>
    );
}

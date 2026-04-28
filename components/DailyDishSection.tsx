import Image from "next/image";
import photoFallback from "../assets/facade-restau.jpg";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { menuItem } from "@/lib/types/menu";
import { IItemFeaturedContent } from "@/lib/types/siteConfig.type";

export default function DailyDish({
    item,
    featuredData,
}: {
    item: menuItem | null;
    featuredData?: IItemFeaturedContent;
}) {
    const imageFallback = featuredData?.imageFallback || "";

    return (
        <section id="itemFeatured" className="relative bg-primary/20 py-10">
            {item ? (
                <div className="max-w-7xl mx-auto px-6">
                    <div className=" rounded-lg h-auto md:h-[50vh] flex flex-col md:flex-row items-stretch overflow-hidden bg-background">
                        {/* Côté Gauche : Photo (50% de largeur) */}
                        <div className="relative w-full md:w-1/2 h-[300px] md:h-auto">
                            <Image
                                src={
                                    item.urlPhoto
                                        ? item.urlPhoto
                                        : imageFallback
                                }
                                alt={item.title || "Suggestion du Chef"}
                                fill
                                className="object-cover transition-opacity duration-300"
                                quality={75}
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority={true}
                            />

                            {featuredData?.badge && (
                                <div className="absolute top-6 left-6">
                                    <Badge className="bg-primary text-primary-foreground px-4 py-1 rounded-full font-body uppercase tracking-widest text-[10px]">
                                        {featuredData?.badge}
                                    </Badge>
                                </div>
                            )}
                        </div>
                        {/* Côté Droit : Contenu (50% de largeur) */}
                        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-20 bg-primary/5">
                            <div className="max-w-md space-y-4 text-center md:text-left">
                                <h2 className="text-4xl md:text-5xl font-bold font-title tracking-tight text-primary leading-none">
                                    {item.title}
                                </h2>

                                <p className="text-muted-foreground font-roboto leading-relaxed">
                                    {item.description}
                                </p>

                                <div className="pt-4 flex items-center justify-center md:justify-start gap-4">
                                    {/* <span className="text-2xl font-bold font-body text-primary">
                                        {item.price} €
                                    </span> */}
                                    <div className="h-px w-12 bg-primary/20" />
                                    {!item.isAvailable && (
                                        <span className="text-xs text-muted-foreground uppercase tracking-widest font-body">
                                            Bientôt disponible
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto px-6">
                    <div className="rounded-lg h-auto md:h-[50vh] flex flex-col md:flex-row items-stretch overflow-hidden bg-background">
                        {/* Côté gauche : image fallback avec overlay */}
                        <div className="relative w-full md:w-1/2 h-[300px] md:h-auto">
                            <Image
                                src={imageFallback}
                                alt="Suggestion du Chef"
                                fill
                                className="object-cover brightness-75"
                                quality={75}
                            />
                            <div className="absolute inset-0 bg-primary/30" />

                            {featuredData?.badge && (
                                <div className="absolute top-6 left-6">
                                    <Badge className="bg-primary text-primary-foreground px-4 py-1 rounded-full font-body uppercase tracking-widest text-[10px]">
                                        {featuredData?.badge}
                                    </Badge>
                                </div>
                            )}
                        </div>
                        {/* Côté droit */}
                        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-20 bg-primary/5">
                            <div className="max-w-md space-y-4 text-center md:text-left">
                                <h2 className="text-4xl md:text-5xl font-bold font-title tracking-tight text-primary leading-none">
                                    À venir aujourd'hui
                                </h2>
                                <p className="text-muted-foreground font-body leading-relaxed">
                                    Notre chef prépare quelque chose de spécial
                                    pour aujourd'hui. Revenez bientôt pour
                                    découvrir la suggestion du jour.
                                </p>
                                <div className="h-px w-12 bg-primary/20" />
                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-body">
                                    Disponible chaque jour dès l'ouverture
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex justify-center pt-12">
                <Link
                    href={featuredData?.buttonUrl || "/menu"}
                    title={featuredData?.buttonText}
                >
                    <Button
                        size="lg"
                        className="group relative h-14 px-10 overflow-hidden rounded-2xl bg-primary text-white transition-all hover:bg-secondary"
                    >
                        <div className="relative flex items-center gap-3">
                            <span className="font-bold tracking-wide uppercase text-sm">
                                {featuredData?.buttonText}
                            </span>
                            <IconArrowRight
                                size={18}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </div>
                    </Button>
                </Link>
            </div>
        </section>
    );
}

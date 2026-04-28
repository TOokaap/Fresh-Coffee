import Image from "next/image";
import photo from "../assets/photo.jpg";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    ContentSchema,
    IHeroContent,
    ISiteConfig,
    SectionSchema,
    SiteTheme,
} from "@/lib/types/siteConfig.type";

export default function HeroSection({
    heroData,
    themeData,
}: {
    heroData?: IHeroContent;
    themeData?: SiteTheme;
}) {
    const hero = heroData;
    const theme = themeData;

    return (
        <section
            id="hero"
            className="relative container mx-auto rounded-b-2xl min-h-10/12 flex flex-col bg-primary md:flex-row items-stretch overflow-hidden"
        >
            {/* Colonne GAUCHE */}
            <div className="flex-[1.2] flex items-center justify-center px-8 lg:px-20 pb-20 pt-32 md:pt-40">
                {/* pt-32 (mobile) et md:pt-40 (desktop) créent l'espace pour ton header 
                   pendant que bg-primary remplit tout le fond jusqu'en haut de l'écran.
                */}
                <div className="max-w-2xl">
                    {hero?.badge && (
                        <div className="inline-block px-3 py-1 mb-6 border border-primary-foreground/20 rounded-full">
                            <span className="text-xs uppercase tracking-[0.2em] text-primary-foreground/80 font-body text-[10px] md:text-xs">
                                {hero?.badge}
                            </span>
                        </div>
                    )}

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold font-title leading-[1.1] text-primary-foreground tracking-tight">
                        {hero?.title || "Le temps s'arrête, le café commence"}
                    </h1>

                    <p className="mt-8 max-w-md font-body text-lg leading-relaxed text-primary-foreground/90">
                        {hero?.description ||
                            "Une escale gourmande où torréfaction artisanale et pâtisseries fines se rencontrent dans un décor intemporel."}
                    </p>

                    <div className="mt-12 flex flex-wrap gap-5">
                        <Link
                            href={hero?.buttonPrimaryUrl || ""}
                            title={hero?.buttonPrimaryText}
                        >
                            <Button
                                size="lg"
                                variant="accent"
                                className="h-14 px-10 rounded-full shadow-lg hover:scale-105 transition-transform"
                                style={{ borderRadius: theme?.borderRadius }}
                            >
                                {hero?.buttonPrimaryText ||
                                    "Découvrir la carte"}
                            </Button>
                        </Link>
                        <Link
                            href={hero?.buttonSecondaryUrl || ""}
                            title={hero?.buttonSecondaryText}
                        >
                            <Button
                                variant="outline"
                                size="lg"
                                className="h-14 px-10 rounded-full hover:bg-primary-foreground/10 transition-all"
                                style={{ borderRadius: theme?.borderRadius }}
                            >
                                {hero?.buttonSecondaryText || "Nos évènements"}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Colonne DROITE */}
            {/* On s'assure que le bg-primary est aussi ici pour que toute la section soit verte */}
            <div className="flex-1 relative flex items-center justify-center p-6 md:p-10 pt-10 md:pt-32">
                <div
                    className="relative h-full w-full min-h-[450px] md:min-h-full rounded-[2rem] overflow-hidden shadow-2xl border-[8px] border-primary-foreground/10"
                    style={{
                        borderRadius: `calc(${
                            theme?.borderRadius || "2rem"
                        } * 1.5)`,
                    }}
                >
                    <Image
                        src={hero?.image || photo}
                        alt={hero?.title || "Intérieur chaleureux"}
                        quality={75}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                    />
                </div>
            </div>
        </section>
    );
}

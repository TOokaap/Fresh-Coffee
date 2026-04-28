import Image from "next/image";
import defaultImage from "../assets/photoAbout.jpg";
import { IAboutContent } from "@/lib/types/siteConfig.type";

const DEFAULT_ABOUT: IAboutContent = {
    title: "Notre parenthèse enchantée",
    quote: "Tout a commencé par un lundi matin de trop.",
    description:
        "Pendant des années, nous avons couru après le temps, un gobelet en carton à la main, dans le vacarme du métro et l'urgence des notifications. Un jour, entre deux réunions, nous avons réalisé que le plaisir simple d'un bon café était devenu une corvée mécanique.\n\nC'est de ce constat qu'est né L'Intermède.\n\nClara et Thomas, les fondateurs, ont voulu créer l'endroit qu'ils cherchaient désespérément : un refuge où l'on a le droit de poser son téléphone, de sentir l'odeur du grain fraîchement moulu et d'écouter le craquement d'une pâtisserie sortant du four.\n\nIci, on cultive l'art de ralentir. Que vous veniez pour peaufiner un projet créatif ou pour refaire le monde entre amis, votre visite sera une véritable respiration dans votre journée.",
    conclusion:
        "Parce que parfois, la chose la plus productive à faire, c'est de prendre le temps d'une pause.",
    image: "",
};

export default function AboutSection({ about }: { about?: IAboutContent }) {
    const data = about ?? DEFAULT_ABOUT;
    const paragraphs = data.description
        .split("\n\n")
        .filter((p) => p.trim() !== "");

    return (
        <section id="about" className="bg-background py-12 md:py-24">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10 lg:gap-20">
                {/* IMAGE */}
                <div className="relative w-full md:w-1/2 group h-[280px] sm:h-[380px] md:h-[500px] lg:h-[600px]">
                    <div className="relative z-10 h-full w-full overflow-hidden rounded-lg shadow-xl">
                        <Image
                            src={data.image || defaultImage}
                            alt={data.title}
                            fill
                            quality={75}
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                </div>

                {/* TEXTE */}
                <div className="w-full md:w-1/2 text-foreground">
                    <h2 className="font-title text-3xl sm:text-4xl md:text-5xl text-primary font-bold mb-6 md:mb-8 leading-tight">
                        {data.title}
                    </h2>

                    <blockquote className="border-l-4 border-accent pl-5 md:pl-6 mb-6 md:mb-8">
                        <p className="font-body italic text-lg md:text-xl lg:text-2xl opacity-90">
                            "{data.quote}"
                        </p>
                    </blockquote>

                    <div className="space-y-4 md:space-y-6 font-body text-base md:text-lg leading-relaxed opacity-95">
                        {paragraphs.map((p, i) => (
                            <p key={i}>{p}</p>
                        ))}

                        <p className="pt-3 md:pt-4 font-semibold text-primary text-lg md:text-xl">
                            {data.conclusion}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

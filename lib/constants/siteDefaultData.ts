import { ISiteConfig } from "../types/siteConfig.type";

export const DEFAULT_DATA: ISiteConfig = {
    theme: {
        primary: { background: "#00473e", foreground: "#ffffff" },
        secondary: { background: "#f3f4f6", foreground: "#1f2937" },
        accent: { background: "#facc15", foreground: "#000000" },
        borderRadius: "0.5rem",
        fonts: {
            title: "Playfair Display",
            body: "Inter",
        },
    },
    header: {
        brandName: "Fresh Coffee",
        logoUrl: "",
        navLinks: [
            { label: "Accueil", href: "/", order: 1 },
            { label: "Menu", href: "/menu", order: 2 },
            { label: "Évènements", href: "/events", order: 3 },
            { label: "News", href: "/news", order: 4 },
            { label: "Gallerie", href: "/gallery", order: 5 },
        ],
        ctaButton: {
            label: "Contact",
            href: "/#contact",
        },
    },
    hero: {
        badge: "Bienvenue",
        title: "Le temps s'arrête, le café commence",
        description: "Une escale gourmande...",
        image: "/assets/photo.jpg",
        buttonPrimary: { text: "Menu", url: "#" },
        buttonSecondary: { text: "Contact", url: "#" },
    },
    about: {
        title: "Notre parenthèse enchantée",
        quote: "Tout a commencé par un lundi matin de trop.",
        description:
            "Pendant des années, nous avons couru après le temps, un gobelet en carton à la main.\n\nC'est de ce constat qu'est né L'Intermède.\n\nClara et Thomas ont voulu créer l'endroit qu'ils cherchaient désespérément : un refuge où l'on a le droit de poser son téléphone.\n\nIci, on cultive l'art de ralentir.",
        conclusion:
            "Parce que parfois, la chose la plus productive à faire, c'est de prendre le temps d'une pause.",
        image: "",
    },
    metadata: { siteName: "Mon Restaurant" },
    isActive: true,
    versionName: "Version par défaut",
};

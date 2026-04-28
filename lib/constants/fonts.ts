export const TITLE_FONTS = [
    {
        name: "Playfair Display",
        description: "Classique & élégant",
    },
    {
        name: "Cormorant Garamond",
        description: "Raffiné & luxueux",
    },
    {
        name: "DM Serif Display",
        description: "Éditorial moderne",
    },
    {
        name: "Fraunces",
        description: "Littéraire & expressif",
    },
    {
        name: "Bodoni Moda",
        description: "Haute couture",
    },
    {
        name: "Montserrat",
        description: "Géométrique & fort",
    },
    {
        name: "Oswald",
        description: "Condensé & impactant",
    },
    {
        name: "Raleway",
        description: "Art déco & élancé",
    },
    {
        name: "Josefin Sans",
        description: "Minimaliste & géométrique",
    },
    {
        name: "Cinzel",
        description: "Romain & solennel",
    },
];

export const BODY_FONTS = [
    {
        name: "Inter",
        description: "Neutre & moderne",
    },
    {
        name: "DM Sans",
        description: "Amical & contemporain",
    },
    {
        name: "Plus Jakarta Sans",
        description: "Polyvalent & actuel",
    },
    {
        name: "Outfit",
        description: "Géométrique & lisible",
    },
    {
        name: "Nunito",
        description: "Arrondi & chaleureux",
    },
    {
        name: "Lato",
        description: "Humaniste & équilibré",
    },
    {
        name: "Open Sans",
        description: "Universel & accessible",
    },
    {
        name: "Jost",
        description: "Contemporain & épuré",
    },
    {
        name: "Source Sans 3",
        description: "Professionnel & lisible",
    },
    {
        name: "Mulish",
        description: "Léger & moderne",
    },
];

// Mapping nom de police → CSS font-family avec les variables next/font + fallbacks
// next/font génère des noms scopés, donc on référence ses CSS variables via var()
export const FONT_CSS_MAP: Record<string, string> = {
    // Title fonts
    "Playfair Display":
        "var(--font-playfair-display), ui-serif, Georgia, serif",
    "Cormorant Garamond":
        "var(--font-cormorant-garamond), ui-serif, Georgia, serif",
    "DM Serif Display":
        "var(--font-dm-serif-display), ui-serif, Georgia, serif",
    Fraunces: "var(--font-fraunces), ui-serif, Georgia, serif",
    "Bodoni Moda": "var(--font-bodoni-moda), ui-serif, Georgia, serif",
    Montserrat: "var(--font-montserrat), ui-sans-serif, system-ui, sans-serif",
    Oswald: "var(--font-oswald), ui-sans-serif, system-ui, sans-serif",
    Raleway: "var(--font-raleway), ui-sans-serif, system-ui, sans-serif",
    "Josefin Sans":
        "var(--font-josefin-sans), ui-sans-serif, system-ui, sans-serif",
    Cinzel: "var(--font-cinzel), ui-serif, Georgia, serif",
    // Body fonts
    Inter: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "DM Sans": "var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif",
    "Plus Jakarta Sans":
        "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif",
    Outfit: "var(--font-outfit), ui-sans-serif, system-ui, sans-serif",
    Nunito: "var(--font-nunito), ui-sans-serif, system-ui, sans-serif",
    Lato: "var(--font-lato), ui-sans-serif, system-ui, sans-serif",
    "Open Sans": "var(--font-open-sans), ui-sans-serif, system-ui, sans-serif",
    Jost: "var(--font-jost), ui-sans-serif, system-ui, sans-serif",
    "Source Sans 3":
        "var(--font-source-sans-3), ui-sans-serif, system-ui, sans-serif",
    Mulish: "var(--font-mulish), ui-sans-serif, system-ui, sans-serif",
};

// Paires prédéfinies (raccourcis rapides)
export const FONT_PAIRS = [
    {
        name: "Élégant & Classique",
        id: "elegant",
        title: "Playfair Display",
        body: "Lato",
    },
    {
        name: "Moderne & Épuré",
        id: "modern",
        title: "Montserrat",
        body: "Inter",
    },
    {
        name: "Rétro & Artisanal",
        id: "retro",
        title: "Oswald",
        body: "Open Sans",
    },
    {
        name: "Doux & Accueillant",
        id: "soft",
        title: "Cormorant Garamond",
        body: "Nunito",
    },
];

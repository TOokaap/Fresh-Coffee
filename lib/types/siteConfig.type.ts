import { Types } from "mongoose";

export interface ColorPair {
    background: string;
    foreground: string;
}

export interface ButtonConfig {
    text: string;
    url: string;
}

export interface SiteTheme {
    primary: ColorPair;
    secondary: ColorPair;
    accent: ColorPair;
    borderRadius: string;
    fonts: {
        title: string;
        body: string;
    };
}

export interface ILinkHeader {
    label: string;
    href: string;
    order: number;
}

export interface IHeader {
    brandName: string;
    logoUrl: string;
    navLinks: ILinkHeader[];
    ctaButton: {
        label: string;
        href: string;
    };
}

export interface IRedirectLink {
    label: string;
    href: string;
}

export interface SiteMetadata {
    siteName: string;
    favicon?: string;
}

// ─── Schema de contenu dynamique ─────────────────────────────────────────────

export interface FieldSchema {
    type: "text" | "textarea" | "image" | "url";
    label: string;
    defaultValue?: string;
}

export interface SectionSchema {
    label: string;
    fields: Record<string, FieldSchema>;
}

export interface ContentSchema {
    sections: Record<string, SectionSchema>;
}

// ─── Schema reflétant la config réelle du projet ──────────────────────────────

export interface IHeroContent {
    badge: string;
    title: string;
    description: string;
    image: string;
    buttonPrimaryText: string;
    buttonPrimaryUrl: string;
    buttonSecondaryText: string;
    buttonSecondaryUrl: string;
}

export interface IAboutContent {
    title: string;
    quote: string;
    description: string;
    conclusion: string;
    image: string;
}

export interface IItemFeaturedContent {
    badge: string;
    buttonText: string;
    buttonUrl: string;
    imageFallback: string;
}

export interface IContactContent {
    title: string;
    description: string;
}

export interface ISiteContent {
    hero: IHeroContent;
    about: IAboutContent;
    itemFeatured: IItemFeaturedContent;
    contact: IContactContent;
}

// ─── Interface principale ─────────────────────────────────────────────────────

export interface ISiteConfig {
    _id?: string;
    etablissementId: Types.ObjectId;
    theme: SiteTheme;
    header: IHeader;
    metadata: SiteMetadata;
    contentSchema: ContentSchema;
    content: ISiteContent;
    redirects: IRedirectLink[];
    isActive: boolean;
    versionName: string;
    createdAt?: Date;
    updatedAt?: Date;
}

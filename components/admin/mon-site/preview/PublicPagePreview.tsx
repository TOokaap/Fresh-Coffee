"use client";

import AboutSection from "@/components/AboutSection";
import DailyDish from "@/components/DailyDishSection";
import GallerySection from "@/components/GallerySection";
import HeroSection from "@/components/HeroSection";
import { FONT_CSS_MAP } from "@/lib/constants/fonts";
import { useEffect, useState } from "react";
import ContactSection from "@/components/ContactSection";
import InstagramSection from "@/components/InstagramSection";
import EventSection from "@/components/events/EventSection";
import { IEvent } from "@/lib/types/events";
import { menuItem } from "@/lib/types/menu";
import { photoItem } from "@/lib/types/gallery";
import { ISiteConfig } from "@/lib/types/siteConfig.type";
import { IEtablissement, IFeatures } from "@/lib/types/etablissement";
import { OpeningHoursDTO } from "@/lib/types/openingHours.type";

export function PublicPagePreview({
    initialData,
    isPreview,
    photos,
    events,
    itemFeatured,
    enabledFeatures,
    etablissement,
    openingHours,
}: {
    initialData: ISiteConfig | null;
    isPreview: boolean;
    photos: photoItem[];
    events: IEvent[];
    itemFeatured: menuItem | null;
    enabledFeatures: IFeatures;
    etablissement: IEtablissement;
    openingHours: OpeningHoursDTO[];
}) {
    // On initialise l'état avec les données du serveur
    const [data, setData] = useState(initialData);

    useEffect(() => {
        if (!isPreview) return;

        const handleMessage = (event: MessageEvent) => {
            console.log(event.origin);
            // ON POURRAIT VERIFIER AVEC UN TOKEN
            // On vérifie que le message vient bien de notre admin
            if (event.origin !== process.env.NEXT_PUBLIC_DASHBOARD_URL) return;
            if (event.data.type === "PREVIEW_DATA") {
                setData(event.data.data);
            }
            if (event.data.type === "SCROLL_TO") {
                document
                    .getElementById(event.data.anchor)
                    ?.scrollIntoView({ behavior: "smooth" });
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [isPreview]);

    const dynamicStyle = {
        "--primary": data?.theme?.primary?.background,
        "--primary-foreground": data?.theme?.primary?.foreground,
        "--accent": data?.theme?.accent?.background,
        "--accent-foreground": data?.theme?.accent?.foreground,
        "--radius": data?.theme?.borderRadius,
        "--site-font-title":
            FONT_CSS_MAP[data?.theme?.fonts?.title ?? ""] ??
            "'Playfair Display', ui-serif, Georgia, serif",
        "--site-font-body":
            FONT_CSS_MAP[data?.theme?.fonts?.body ?? ""] ??
            "'Inter', ui-sans-serif, system-ui, sans-serif",
    } as React.CSSProperties;

    useEffect(() => {
        Object.entries(dynamicStyle).forEach(([key, value]) => {
            document.body.style.setProperty(key, value as string);
        });
    }, [dynamicStyle]);

    return (
        <div style={dynamicStyle}>
            <HeroSection
                heroData={data?.content.hero}
                themeData={data?.theme}
            />
            <AboutSection about={data?.content.about} />
            {enabledFeatures.menu && (
                <DailyDish
                    item={itemFeatured}
                    featuredData={data?.content.itemFeatured}
                />
            )}

            {enabledFeatures.events && <EventSection events={events} />}
            {enabledFeatures.gallery && <GallerySection photos={photos} />}

            <ContactSection
                contactContent={data?.content.contact}
                etablissement={etablissement}
                openingHours={openingHours}
            />
        </div>
    );
}

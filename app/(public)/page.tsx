import AboutSection from "@/components/AboutSection";
import DailyDish from "@/components/DailyDishSection";
import GallerySection from "@/components/GallerySection";
import HeroSection from "@/components/HeroSection";

import { PublicPagePreview } from "@/components/admin/mon-site/preview/PublicPagePreview";
import ContactSection from "@/components/ContactSection";
import EventSection from "@/components/events/EventSection";
import { DEFAULT_DATA } from "@/lib/constants/siteDefaultData";
import {
    getEtablissement,
    getEvents,
    getItemFeatured,
    getOpeningHours,
    getPhotos,
    getSiteConfig,
} from "@/lib/api";

export default async function Home({
    searchParams,
}: {
    searchParams: Promise<{ preview?: string }>;
}) {
    const resolvedParams = await searchParams;
    const isPreview = resolvedParams.preview === "true";

    const [
        siteData,
        galleryData,
        events,
        itemFeatured,
        etablissement,
        openingHours,
    ] = await Promise.all([
        getSiteConfig(),
        getPhotos("published"),
        getEvents(),
        getItemFeatured(),
        getEtablissement(),
        getOpeningHours(),
    ]);

    const enabledFeatures = etablissement.features;

    if (isPreview) {
        return (
            <PublicPagePreview
                initialData={siteData}
                isPreview={true}
                photos={galleryData}
                events={events}
                itemFeatured={itemFeatured}
                enabledFeatures={enabledFeatures}
                etablissement={etablissement}
                openingHours={openingHours}
            />
        );
    }

    return (
        <div>
            <HeroSection
                heroData={siteData?.content.hero}
                themeData={siteData?.theme}
            />
            <AboutSection about={siteData?.content.about} />
            {enabledFeatures.menu && (
                <DailyDish
                    item={itemFeatured}
                    featuredData={siteData?.content.itemFeatured}
                />
            )}
            {enabledFeatures.events && <EventSection events={events} />}
            {enabledFeatures.gallery && <GallerySection photos={galleryData} />}

            <ContactSection
                contactContent={siteData.content.contact}
                etablissement={etablissement}
                openingHours={openingHours}
            />
        </div>
    );
}

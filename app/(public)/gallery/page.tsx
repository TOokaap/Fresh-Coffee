import { Separator } from "@/components/ui/separator";
import { getEtablissement, getPhotos } from "@/lib/api";
import { redirect } from "next/navigation";
import { photoItem } from "@/lib/types/gallery";

import Image from "next/image";

export default async function GalleryPage() {
    const etablissement = await getEtablissement();
    if (!etablissement.features.gallery) redirect("/");

    const photos = await getPhotos("published");

    console.log(photos);

    return (
        <main className="bg-background min-h-screen flex flex-col items-center">
            <section className="py-12 md:py-20">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-title mt-15 md:mt-20 mb-6">
                        Notre <span className="text-primary">Galerie</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto font-body">
                        Plongez dans l'ambiance de FreshCoffee : nos créations,
                        nos moments de partage et les coulisses de notre
                        artisanat à Béthune.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-6">
                <Separator />
            </div>

            {photos.length > 0 ? (
                <section className="space-y-10 md:space-y-16 py-10 md:py-16 container mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {photos.map((photo: photoItem) => (
                            <div
                                key={photo._id}
                                className="relative aspect-square overflow-hidden rounded-xl"
                            >
                                <Image
                                    src={photo.urlImage}
                                    alt={photo.alt}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    quality={75}
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </section>
            ) : (
                <section className="py-20 text-center">
                    <p className="text-muted-foreground font-body">
                        Aucune photo disponible pour le moment. Revenez bientôt
                        !
                    </p>
                </section>
            )}
        </main>
    );
}

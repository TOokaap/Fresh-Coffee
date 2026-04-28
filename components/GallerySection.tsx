import Image from "next/image";
import Link from "next/link";
import { IconArrowRight, IconChevronRight } from "@tabler/icons-react";
import { ArrowRight } from "lucide-react";
import { photoItem } from "@/lib/types/gallery";

export default function GallerySection({ photos }: { photos: photoItem[] }) {
    const photosToDisplay = photos.slice(0, 4);

    return (
        <section id="gallery" className="py-24 bg-background">
            <div className="mx-auto px-6 max-w-7xl">
                {/* Titre de la galerie */}
                <div className="mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-title text-primary mb-8">
                        Captures de{" "}
                        <span className="text-primary font-title">moments</span>
                    </h2>
                    <p className="text-lg font-body text-muted-foreground max-w-3xl">
                        Plongez dans l'ambiance de notre établissement à
                        Béthune, entre tradition et modernité.
                    </p>
                </div>

                {/* La Grille Magique (Evolutive) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {photosToDisplay?.map((photo, index) => (
                        <div
                            key={photo._id}
                            className="group relative aspect-square overflow-hidden rounded-2xl bg-muted"
                        >
                            <Image
                                src={photo.urlImage}
                                alt={photo.alt || "Instant café à Béthune"}
                                fill
                                className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
                                // AJUSTEMENT DES SIZES :
                                // Mobile: 100vw, Tablette: 50vw, Desktop: 33vw, Grand écran: 25vw
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                // OPTIMISATION : Charger les 4 premières images plus vite, les autres en "lazy"

                                quality={75}
                            />

                            {/* Overlay élégant au survol */}
                            <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                <span className="text-primary-foreground font-body font-medium tracking-widest uppercase text-sm border-b border-primary-foreground pb-1">
                                    {photo.title}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="w-full flex items-center justify-end mt-10">
                    <Link
                        href="/gallery"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                    >
                        Découvrir plus de photos
                        <IconArrowRight
                            size={18}
                            className="group-hover:translate-x-1 transition-transform"
                        />
                    </Link>
                </div>
            </div>
        </section>
    );
}

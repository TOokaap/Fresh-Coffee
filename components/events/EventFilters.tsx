"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    IconMusic,
    IconTools,
    IconGlassFull,
    IconUsers,
    IconLayoutGrid,
} from "@tabler/icons-react";

const EVENT_CATEGORIES = [
    {
        label: "Tous",
        slug: null,
        icon: IconLayoutGrid,
    },
    {
        label: "Atelier",
        slug: "workshop",
        icon: IconTools,
    },
    {
        label: "Musique",
        slug: "music",
        icon: IconMusic,
    },
    {
        label: "Dégustation",
        slug: "tasting",
        icon: IconGlassFull,
    },
    {
        label: "Communauté",
        slug: "community",
        icon: IconUsers,
    },
];

export function EventFilter() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const activeCategory = searchParams.get("category");

    const toggleCategory = (slug: string | null) => {
        const params = new URLSearchParams(window.location.search);

        if (!slug) {
            params.delete("category");
        } else {
            params.set("category", slug);
        }

        // On utilise window.history pour une mise à jour fluide sans rechargement lourd
        router.push(`?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="flex flex-wrap justify-center gap-3">
            {EVENT_CATEGORIES.map((cat) => {
                const isActive =
                    activeCategory === cat.slug ||
                    (cat.slug === null && !activeCategory);
                const Icon = cat.icon;

                return (
                    <button
                        key={cat.label}
                        onClick={() => toggleCategory(cat.slug)}
                        className={cn(
                            "flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 cursor-pointer rounded-full border transition-all duration-300 text-sm font-semibold",
                            isActive
                                ? `bg-primary text-primary-foreground shadow-md scale-105 border-transparent`
                                : "bg-white/50 backdrop-blur-sm border-slate-200 text-slate-600 hover:border-primary/40 hover:text-primary hover:bg-white"
                        )}
                    >
                        <Icon size={18} stroke={2} />
                        {cat.label}
                    </button>
                );
            })}
        </div>
    );
}

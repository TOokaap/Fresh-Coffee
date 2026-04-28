"use client";

import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { LabelItem, LabelList } from "@/lib/types/label.type";

export function MenuBadgesFilter({
    labels,
    activeFilter,
    onFilterChange,
}: {
    labels: LabelList[];
    activeFilter: string | null;
    onFilterChange: (filter: string | null) => void;
}) {
    const searchParams = useSearchParams();

    const activeLabel = searchParams.get("filter");

    const toggleLabel = (slug: string) => {
        const nextFilter = activeFilter === slug ? null : slug;

        onFilterChange(nextFilter);

        const params = new URLSearchParams(window.location.search);
        if (!nextFilter) {
            params.delete("filter");
        } else {
            params.set("filter", slug);
        }

        window.history.replaceState(null, "", `?${params.toString()}`);
    };

    const labelsItems = labels
        ?.flatMap((group) => group.items)
        .filter((l) => l.isFilterable === true);

    return (
        <div className="flex flex-wrap justify-center gap-3 mb-12">
            {labelsItems &&
                labelsItems.map((item: LabelItem) => {
                    const isActive = activeLabel === item.slug;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item._id}
                            onClick={() => toggleLabel(item.slug)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 cursor-pointer rounded-full border transition-all duration-100 text-sm font-medium",
                                isActive
                                    ? `${item.color} shadow-sm scale-105 border-transparent ring-2 ring-offset-1 ring-primary/20`
                                    : "bg-background border-muted-foreground/20 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                            )}
                        >
                            {item.label}
                        </button>
                    );
                })}
        </div>
    );
}

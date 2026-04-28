"use client";

import { Input } from "@/components/ui/input";
import { Loader2, Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";

export function SearchBar() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [isPending, startTransition] = useTransition();

    const inputRef = useRef<HTMLInputElement>(null);

    const currentSearch = searchParams.get("searchText")?.toString() || "";

    const handleSearch = useDebouncedCallback((term) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("searchText", term);
        } else {
            params.delete("searchText");
        }

        // startTransition permet de garder l'input réactif pendant que Next.js charge les données
        startTransition(() => {
            replace(`${pathname}?${params.toString()}`, { scroll: false });
        });
    }, 300);

    // Fonction pour vider la recherche
    const clearSearch = () => {
        if (inputRef.current) {
            inputRef.current.value = "";
            handleSearch("");
            inputRef.current.focus();
        }
    };

    return (
        <div className="relative w-full max-w-sm">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin " />
                ) : (
                    <Search className="h-4 w-4 text-muted-foreground" />
                )}
            </div>
            <Input
                ref={inputRef}
                type="text"
                placeholder="Rechercher un élément..."
                className="pl-10 rounded-2xl font-body"
                defaultValue={searchParams.get("searchText")?.toString()}
                onChange={(e) => handleSearch(e.target.value)}
            />
            {currentSearch && (
                <button
                    onClick={clearSearch}
                    className="absolute right-4 p-1 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200"
                    title="Vider la recherche"
                >
                    <X className="h-5 w-5 absolute right-0 top-2" />
                </button>
            )}
        </div>
    );
}

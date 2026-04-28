"use client";

import { Menu, X, Coffee } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import { IHeader } from "@/lib/types/siteConfig.type";
import { IFeatures } from "@/lib/types/etablissement";

const FEATURE_ROUTES: Partial<Record<keyof IFeatures, string>> = {
    menu: "/menu",
    events: "/events",
    news: "/news",
    gallery: "/gallery",
    reservations: "/reservation",
};

export default function Header({
    data,
    enabledFeatures,
}: {
    data: IHeader;
    enabledFeatures: IFeatures;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isHome = pathname === "/";

    const visibleLinks = data.navLinks.filter((link) => {
        const feature = Object.entries(FEATURE_ROUTES).find(([, route]) =>
            link.href.startsWith(route!)
        )?.[0] as keyof IFeatures | undefined;
        return !feature || enabledFeatures[feature];
    });

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return (
            pathname.startsWith(href.split("#")[0]) &&
            href.split("#")[0] !== "/"
        );
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 w-full overflow-x-hidden transition-all duration-500 ${
                !isHome || scrolled
                    ? "bg-primary/95 backdrop-blur-md shadow-lg"
                    : "bg-transparent"
            }`}
        >
            <nav className="mx-auto flex w-full lg:max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                {/* Logo */}
                <a href="/" className="flex items-center gap-2 group">
                    <div className="p-1.5 rounded-lg bg-primary-foreground/10 group-hover:bg-primary-foreground/20 transition-colors">
                        <Coffee className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="font-title text-2xl font-bold tracking-wide text-primary-foreground">
                        {data.brandName}
                    </span>
                </a>

                {/* Desktop nav */}
                <ul className="hidden items-center gap-8 md:flex">
                    {visibleLinks.map((link) => {
                        const active = isActive(link.href);
                        return (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="relative text-sm tracking-widest uppercase text-primary-foreground transition-colors group py-1"
                                >
                                    {link.label}
                                    {/* Barre animée au hover */}
                                    <span
                                        className={`absolute -bottom-0.5 left-0 h-px bg-primary-foreground transition-all duration-300 ${
                                            active
                                                ? "w-full"
                                                : "w-0 group-hover:w-full"
                                        }`}
                                    />
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {data.ctaButton.label && (
                    <Link
                        href={data.ctaButton.href}
                        // href={data.ctaButton.href}
                        className="hidden md:flex"
                    >
                        <Button variant="accent">{data.ctaButton.label}</Button>
                    </Link>
                )}

                {/* Mobile toggle */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-primary-foreground p-2 rounded-lg hover:bg-primary-foreground/10 transition-colors"
                    aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
                >
                    {isOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </button>
            </nav>

            {/* Mobile menu avec animation */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="border-t border-primary-foreground/10 bg-primary/95 backdrop-blur-md">
                    <ul className="flex flex-col gap-1 px-6 py-4">
                        {visibleLinks.map((link) => {
                            const active = isActive(link.href);
                            return (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-2 py-3 text-sm tracking-widest uppercase transition-colors ${
                                            active
                                                ? "text-primary-foreground font-semibold"
                                                : "text-primary-foreground/70 hover:text-primary-foreground"
                                        }`}
                                    >
                                        {active && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                                        )}
                                        {link.label}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                    <div className="px-6 pb-5">
                        <Link
                            href="/reservation"
                            // href={data.ctaButton.href}
                            onClick={() => setIsOpen(false)}
                        >
                            <Button variant="accent" className="w-full">
                                {/* {data.ctaButton.label} */} Réserver une
                                table
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}

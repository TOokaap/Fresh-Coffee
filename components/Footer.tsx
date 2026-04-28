import Link from "next/link";
import {
    IconBrandInstagram,
    IconBrandFacebook,
    IconMail,
    IconPhone,
    IconMapPin,
    IconCoffee,
    IconBrandTiktok,
} from "@tabler/icons-react";

import { SiTripadvisor } from "react-icons/si";
import { getEtablissement } from "@/lib/api";
import { IEtablissement } from "@/lib/types/etablissement";

export default async function Footer({
    etablissement,
}: {
    etablissement: IEtablissement;
}) {
    const currentYear = new Date().getFullYear();

    const adress = etablissement?.address.split(",");

    const adressStart = adress?.[0];
    const city = adress?.[1];

    return (
        <footer className="bg-primary text-primary-foreground">
            <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* COLONNE 1 : BRAND & DESCRIPTION */}
                    <div className="space-y-6">
                        <Link
                            href="/"
                            className="flex items-center gap-2 group"
                        >
                            <div className="p-2 bg-primary rounded-xl group-hover:rotate-12 transition-transform">
                                <IconCoffee
                                    size={24}
                                    className="text-primary-foreground"
                                />
                            </div>
                            <span className="text-2xl font-primary font-bold tracking-wide font-title">
                                {etablissement?.name}
                            </span>
                        </Link>
                        <p className=" leading-relaxed text-sm">
                            {etablissement?.description}
                        </p>
                        <div className="flex items-center gap-4">
                            {/* Bouton instagram */}
                            {etablissement?.socialLinks.instagram && (
                                <Link
                                    href={etablissement?.socialLinks.instagram}
                                    className="p-2 rounded-full bg-coffee-900 hover:bg-primary transition-colors"
                                >
                                    <IconBrandInstagram size={20} />
                                </Link>
                            )}
                            {/* Bouton Facebook */}
                            {etablissement?.socialLinks.facebook && (
                                <Link
                                    href={etablissement?.socialLinks.facebook}
                                    className="p-2 rounded-full bg-coffee-900 hover:bg-primary transition-colors"
                                >
                                    <IconBrandFacebook size={20} />
                                </Link>
                            )}
                            {/* Bouton TikTok */}
                            {etablissement?.socialLinks.tiktok && (
                                <Link
                                    href={etablissement?.socialLinks.tiktok}
                                    className="p-2 rounded-full bg-coffee-900 hover:bg-primary transition-colors"
                                >
                                    <IconBrandTiktok size={20} />
                                </Link>
                            )}
                            {/* Bouton TripAdvisor */}
                            {etablissement?.socialLinks.tripadvisor && (
                                <Link
                                    href={
                                        etablissement?.socialLinks.tripadvisor
                                    }
                                    className="p-2 rounded-full bg-coffee-900 hover:bg-primary transition-colors"
                                >
                                    <SiTripadvisor size={20} />
                                </Link>
                            )}
                            {/* Bouton TheFork */}
                            {/* Je ne trouve pas d'icône the fork  */}
                            {/* {etablissement?.socialLinks.thefork && (
                                <Link
                                    href={etablissement?.socialLinks.thefork}
                                    className="p-2 rounded-full bg-coffee-900 hover:bg-primary transition-colors"
                                >
                                    <SiTripadvisor size={20} />
                                </Link>
                            )} */}
                        </div>
                    </div>

                    {/* COLONNE 2 : NAVIGATION RAPIDE */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-bold">Explorer</h4>
                        <ul className="space-y-4 text-sm text-coffee-400">
                            <li>
                                <Link
                                    href="/"
                                    className="hover:text-primary transition-colors"
                                >
                                    Accueil
                                </Link>
                            </li>
                            {etablissement.features.menu && (
                                <li>
                                    <Link
                                        href="/menu"
                                        className="hover:text-primary transition-colors"
                                    >
                                        Menu
                                    </Link>
                                </li>
                            )}
                            {etablissement.features.events && (
                                <li>
                                    <Link
                                        href="/events"
                                        className="hover:text-primary transition-colors"
                                    >
                                        Évènements
                                    </Link>
                                </li>
                            )}
                            <li>
                                <Link
                                    href="/#about"
                                    className="hover:text-primary transition-colors"
                                >
                                    À propos
                                </Link>
                            </li>
                            {etablissement.features.news && (
                                <li>
                                    <Link
                                        href="/news"
                                        className="hover:text-primary transition-colors"
                                    >
                                        News
                                    </Link>
                                </li>
                            )}
                            {etablissement.features.gallery && (
                                <li>
                                    <Link
                                        href="/gallery"
                                        className="hover:text-primary transition-colors"
                                    >
                                        Gallerie
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* COLONNE 3 : INFOS PRATIQUES */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-bold">Nous trouver</h4>
                        <ul className="space-y-4 text-sm text-primary-foreground">
                            <li className="flex items-start gap-3">
                                <IconMapPin size={18} className="shrink-0" />

                                {adressStart && city ? (
                                    <span>
                                        {adress?.[0]},
                                        <br />
                                        {adress?.[1]}
                                    </span>
                                ) : (
                                    <span>{adress}</span>
                                )}
                            </li>
                            <li className="flex items-center gap-3">
                                <IconPhone size={18} className=" shrink-0" />
                                <span>{etablissement?.phone}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <IconMail size={18} className="shrink-0" />
                                <span>{etablissement?.email}</span>
                            </li>
                        </ul>
                    </div>

                    {/* COLONNE 4 : HORAIRES */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-bold">Horaires</h4>
                        <div className="space-y-3 text-sm text-coffee-400 bg-coffee-900/50 p-5 rounded-2xl border border-coffee-800">
                            <div className="flex justify-between">
                                <span>Lun - Ven</span>
                                <span className="font-medium text-coffee-100">
                                    08:30 - 18:30
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Samedi</span>
                                <span className="font-medium text-coffee-100">
                                    09:00 - 19:00
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Dimanche</span>
                                <span className="font-medium text-primary uppercase font-bold text-[10px] tracking-widest pt-1">
                                    Fermé
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BOTTOM BAR */}
                <div className="mt-16 pt-8 border-t border-coffee-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-coffee-500">
                    <p>
                        © {currentYear} {etablissement?.name}. Tous droits
                        réservés. <span>Site réalisé par Webitecte</span>
                    </p>
                    <div className="flex gap-6">
                        <Link href="/legal" className="hover:text-coffee-300">
                            Mentions Légales
                        </Link>
                        <Link href="/cookies" className="hover:text-coffee-300">
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

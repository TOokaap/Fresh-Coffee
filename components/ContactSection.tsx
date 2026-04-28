import { IEtablissement } from "@/lib/types/etablissement";
import { OpeningHoursDTO } from "@/lib/types/openingHours.type";
import { IContactContent } from "@/lib/types/siteConfig.type";
import {
    MapPin,
    Clock,
    Phone,
    Mail,
    ArrowRight,
    Coffee,
    Wifi,
} from "lucide-react";

const DAY_LABELS = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
];
// Ordre d'affichage : Lun→Dim (index dans DAY_LABELS : 1,2,3,4,5,6,0)
const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

export default function ContactSection({
    contactContent,
    etablissement,
    openingHours,
}: {
    contactContent?: IContactContent;
    etablissement?: IEtablissement;
    openingHours: OpeningHoursDTO[];
}) {

    const adress = etablissement?.address.split(",");

    const adressStart = adress?.[0];
    const city = adress?.[1];

    //Vérification du src de l'iframe
    const safeMapUrl = etablissement?.mapEmbedUrl?.startsWith(
        "https://www.google.com/maps/embed"
    )
        ? etablissement.mapEmbedUrl
        : null;

    return (
        <section
            id="contact"
            className="py-24 px-6 md:px-12 bg-background text-foreground"
        >
            <div className="max-w-7xl mx-auto px-6">
                {/* ── EN-TÊTE*/}
                <div className="mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-title text-primary mb-8">
                        {contactContent?.title}
                    </h2>
                    <p className="text-muted-foreground font-body text-lg max-w-xl">
                        {contactContent?.description}
                    </p>
                </div>

                {/* ── GRILLE PRINCIPALE ───────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start">
                    {/* GAUCHE : Carte + chip adresse superposée */}
                    <div className="relative">
                        {/* Fond décoratif décalé */}
                        <div className="absolute -bottom-4 -right-4 w-full h-full bg-primary/5 rounded-3xl -z-10" />

                        <div className="rounded-2xl overflow-hidden shadow-xl border border-primary/10 aspect-[4/3] lg:aspect-auto lg:h-[540px] relative">
                            {safeMapUrl && (
                                <iframe
                                    src={etablissement?.mapEmbedUrl}
                                    width="100%"
                                    height="100%"
                                    style={{
                                        border: 0,
                                        filter: "grayscale(15%) contrast(105%)",
                                    }}
                                    allowFullScreen
                                    loading="lazy"
                                    title="Localisation Fresh Coffee"
                                />
                            )}

                            {/* Chip adresse flottante en bas de la carte */}
                            <div className="absolute bottom-0 left-0 right-0 m-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg border border-primary/10 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
                                        <MapPin className="w-4 h-4 text-primary-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-foreground leading-tight">
                                            {adress?.[0]}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {adress?.[1]}
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href={`https://maps.google.com/?q=${encodeURIComponent(
                                        etablissement?.address ?? ""
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-1 text-xs font-semibold text-primary shrink-0 hover:gap-2 transition-all"
                                >
                                    Itinéraire
                                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* DROITE : Contact + Horaires */}
                    <div className="space-y-8">
                        {/* Cartes contact */}
                        <div className="grid grid-cols-2 gap-4">
                            <a
                                href="tel:0321000000"
                                className="group flex items-center gap-3 p-4 rounded-xl border border-primary/10 bg-primary/5 hover:bg-primary/10 hover:border-primary/20 transition-all"
                            >
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                                    <Phone className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-body">
                                        Téléphone
                                    </p>
                                    <p className="text-sm font-semibold text-foreground">
                                        {etablissement?.phone}
                                    </p>
                                </div>
                            </a>
                            <a
                                href="mailto:hello@freshcoffee.fr"
                                className="group flex items-center gap-3 p-4 rounded-xl border border-primary/10 bg-primary/5 hover:bg-primary/10 hover:border-primary/20 transition-all"
                            >
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                                    <Mail className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-body">
                                        Email
                                    </p>
                                    <p className="text-sm font-semibold text-foreground truncate">
                                        {etablissement?.email}
                                    </p>
                                </div>
                            </a>
                        </div>

                        {/* Séparateur horaires */}
                        <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-primary/10" />
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="w-3.5 h-3.5 text-primary" />
                                <span className="uppercase tracking-wider font-body">
                                    Nos horaires
                                </span>
                            </div>
                            <div className="h-px flex-1 bg-primary/10" />
                        </div>

                        {/* Liste horaires — ligne du jour mise en avant */}
                        <div className="space-y-1">
                            {DISPLAY_ORDER.map((dayOfWeek) => {
                                const entry = openingHours.find(
                                    (h) => h.dayOfWeek === dayOfWeek
                                );
                                const isClosed = !entry || entry.isClosed;
                                const timeStr = isClosed
                                    ? "Fermé"
                                    : entry.openingRanges
                                          .map((r) => `${r.from} - ${r.to}`)
                                          .join(" ⎜ ");
                                const todayDow = new Date().getDay();
                                const isToday = dayOfWeek === todayDow;

                                return (
                                    <div
                                        key={dayOfWeek}
                                        className={`flex items-center justify-between py-3 px-4 rounded-xl transition-colors ${
                                            isToday
                                                ? "bg-primary text-primary-foreground"
                                                : "hover:bg-muted/60"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            {isToday && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                                            )}
                                            <span
                                                className={`font-body text-sm font-medium ${
                                                    isToday
                                                        ? "text-primary-foreground"
                                                        : "text-foreground"
                                                }`}
                                            >
                                                {DAY_LABELS[dayOfWeek]}
                                            </span>
                                            {isToday && (
                                                <span className="text-[9px] uppercase tracking-widest bg-primary-foreground/20 text-primary-foreground px-2 py-0.5 rounded-full font-body">
                                                    Aujourd'hui
                                                </span>
                                            )}
                                        </div>
                                        <span
                                            className={`font-body text-sm font-semibold ${
                                                isClosed && !isToday
                                                    ? "text-destructive"
                                                    : isToday
                                                    ? "text-primary-foreground"
                                                    : "text-muted-foreground"
                                            }`}
                                        >
                                            {timeStr}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Infos pratiques */}
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground bg-muted/50 rounded-xl px-4 py-3">
                            <span className="flex items-center gap-1.5 font-body">
                                <Coffee className="w-3.5 h-3.5 text-primary shrink-0" />
                                Boissons artisanales sur place
                            </span>
                            <span className="h-3 w-px bg-primary/20 hidden sm:block" />
                            <span className="flex items-center gap-1.5 font-body">
                                <Wifi className="w-3.5 h-3.5 text-primary shrink-0" />
                                Wifi gratuit
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

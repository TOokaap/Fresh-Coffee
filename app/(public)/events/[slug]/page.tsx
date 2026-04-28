import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORY_LABELS } from "@/lib/constants/events";
import {
    IconCalendar,
    IconClock,
    IconMapPin,
    IconTicket,
    IconChevronLeft,
    IconUsers,
    IconChevronRight,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { EventCard } from "@/components/events/EventCard";
import { getEtablissement, getEventBySlug, getEvents } from "@/lib/api";
import { IEvent } from "@/lib/types/events";

export default async function EventDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const etablissement = await getEtablissement();
    if (!etablissement.features.events) redirect("/");

    const { slug } = await params;
    const [event, allEvents] = await Promise.all([
        getEventBySlug(slug),
        getEvents(),
    ]);

    const today = new Date().toISOString().split("T")[0];

    const upcoming = allEvents.filter(
        (event: IEvent) =>
            new Date(event.date).toISOString().split("T")[0] >= today
    );

    if (!event) notFound();

    const otherEvents = upcoming
        .filter((e: IEvent) => e.slug !== slug)
        .slice(0, 3);

    const eventDate = new Date(event.date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <main className="min-h-screen bg-background py-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <Link
                    href="/events"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                >
                    <IconChevronLeft
                        size={20}
                        className="group-hover:-translate-x-1 transition-transform"
                    />
                    Retour aux évènements
                </Link>
            </div>

            <article className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                    <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border">
                        <Image
                            src={event.urlImage}
                            alt={event.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    <div className="space-y-4">
                        <Badge>{CATEGORY_LABELS[event.category]}</Badge>
                        <h1 className="text-4xl md:text-6xl font-title leading-tight">
                            {event.title}
                        </h1>
                        <p className="text-xl text-muted-foreground font-title leading-relaxed">
                            {event.shortDescription}
                        </p>
                    </div>

                    <div className="prose prose-stone max-w-none prose-lg">
                        <div className="whitespace-pre-wrap font-body leading-loose">
                            {event.description}
                        </div>
                    </div>
                </div>

                <aside className="lg:col-start-3">
                    <div className="sticky top-24 bg-white rounded-3xl border p-8 shadow-xl shadow-coffee-900/5 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold font-body border-b pb-4">
                                Infos pratiques
                            </h2>
                            {event.isFull && (
                                <Badge
                                    variant="secondary"
                                    className="text-white uppercase text-sm px-3 "
                                >
                                    Complet
                                </Badge>
                            )}
                        </div>

                        <div className="space-y-6 font-body">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                    <IconCalendar size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground uppercase font-bold tracking-widest">
                                        Date
                                    </p>
                                    <p className="font-semibold text-lg">
                                        {eventDate}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                    <IconClock size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground uppercase font-bold tracking-widest">
                                        Horaire
                                    </p>
                                    <p className="font-semibold text-lg">
                                        {event.startTime}{" "}
                                        {event.endTime && `— ${event.endTime}`}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                    <IconTicket size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground uppercase font-bold tracking-widest">
                                        Tarif
                                    </p>
                                    <p className="font-semibold text-lg">
                                        {event.price === 0
                                            ? "Gratuit"
                                            : `${event.price}€`}
                                    </p>
                                </div>
                            </div>

                            {event.capacity && (
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                        <IconUsers size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground uppercase font-bold tracking-widest">
                                            Capacité
                                        </p>
                                        <p className="font-semibold text-lg">
                                            {event.capacity} personnes max
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                    <IconMapPin size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground uppercase font-bold tracking-widest">
                                        Lieu
                                    </p>
                                    <p className="font-semibold text-lg">
                                        {event.location ||
                                            "Fresh Coffee, Béthune"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <Button
                                size="lg"
                                className="w-full h-14 text-lg rounded-2xl font-bold"
                                disabled={event.isFull}
                                asChild={!event.isFull}
                            >
                                {event.isFull ? (
                                    <span>Plus de places disponibles</span>
                                ) : (
                                    <Link href="/#contact">
                                        Réserver ou s'inscrire
                                    </Link>
                                )}
                            </Button>
                            <p className="text-center text-xs text-muted-foreground mt-4 italic">
                                Une question ? Contactez-nous au café !
                            </p>
                        </div>
                    </div>
                </aside>
            </article>

            {otherEvents.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 mt-24">
                    <div className="flex items-center gap-4 mb-10">
                        <h2 className="text-3xl font-title shrink-0">
                            Autres évènements
                        </h2>
                        <div className="h-px flex-1 bg-border" />
                        <Link
                            href="/events"
                            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                        >
                            Voir tout
                            <IconChevronRight
                                size={20}
                                className="group-hover:translate-x-1 transition-transform"
                            />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {otherEvents.map((e: IEvent, index: number) => (
                            <EventCard key={e.slug} event={e} index={index} />
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}

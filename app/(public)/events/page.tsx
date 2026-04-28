import { EventCard } from "@/components/events/EventCard";
import { EventFilter } from "@/components/events/EventFilters";
import { Separator } from "@/components/ui/separator";
import { getEtablissement, getEvents } from "@/lib/api";
import { redirect } from "next/navigation";
import { IEvent } from "@/lib/types/events";

export default async function EventPage({
    searchParams,
}: {
    searchParams: Promise<{
        category?: "workshop" | "music" | "tasting" | "community";
    }>;
}) {
    const etablissement = await getEtablissement();
    if (!etablissement.features.events) redirect("/");

    const events = await getEvents();

    const { category } = await searchParams;

    const today = new Date().toISOString().split("T")[0];

    const filteredEvents = events.filter(
        (event: IEvent) => !category || event.category === category
    );

    const upcoming = filteredEvents.filter(
        (event: IEvent) =>
            new Date(event.date).toISOString().split("T")[0] >= today
    );
    const past = filteredEvents.filter(
        (event: IEvent) =>
            new Date(event.date).toISOString().split("T")[0] < today
    );

    if (!events || events.length === 0) {
        return (
            <section className="py-20 text-center">
                <h2 className="text-3xl font-bold mb-4">
                    Prochains Évènements
                </h2>
                <p className="text-muted-foreground">
                    Pas d'évènements prévus pour le moment. Revenez bientôt ! ☕
                </p>
            </section>
        );
    }

    return (
        <main className="bg-background min-h-screen flex flex-col items-center">
            <section className="py-12 md:py-20">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-title mt-15 md:mt-20 mb-6">
                        Événements &{" "}
                        <span className="text-primary">Rencontres</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto font-body">
                        Ateliers barista, dégustations de crus d'exception,
                        concerts acoustiques... Découvrez nos prochains
                        rendez-vous à Béthune.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-6">
                <Separator />
            </div>

            <div className="container mx-auto px-6 mt-5 md:mt-15">
                <EventFilter />
            </div>

            <section className="space-y-10 md:space-y-16 py-10 md:py-16 container mx-auto px-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-2xl md:text-3xl font-title">
                        Prochains rendez-vous
                    </h3>
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="flex items-center gap-2">
                            <p className="text-xl md:text-2xl font-bold text-muted-foreground">
                                {upcoming.length}
                            </p>
                            <p className="text-xs uppercase tracking-widest text-muted-foreground">
                                À venir
                            </p>
                        </div>
                        <div className="w-px h-8 bg-border" />
                        <div className="flex items-center gap-2">
                            <p className="text-xl md:text-2xl font-bold text-muted-foreground">
                                {
                                    upcoming.filter((e: IEvent) => {
                                        const diff =
                                            (new Date(e.date).getTime() -
                                                Date.now()) /
                                            (1000 * 60 * 60 * 24);
                                        return diff >= 0 && diff <= 7;
                                    }).length
                                }
                            </p>
                            <p className="text-xs uppercase tracking-widest text-muted-foreground">
                                Cette semaine
                            </p>
                        </div>
                    </div>
                </div>

                {upcoming.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {upcoming.map((event: IEvent, index: number) => (
                            <EventCard
                                key={event._id.toString()}
                                event={event}
                                index={index}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                        <span className="text-5xl">☕</span>
                        <h4 className="text-xl font-title">
                            Rien de prévu pour le moment
                        </h4>
                        <p className="text-muted-foreground font-body max-w-sm">
                            Revenez bientôt, de nouveaux rendez-vous arrivent
                            régulièrement.
                        </p>
                    </div>
                )}

                {past.length > 0 && (
                    <>
                        <div className="flex items-center gap-4">
                            <h3 className="text-2xl md:text-3xl font-title shrink-0">
                                C'était au Fresh Coffee...
                            </h3>
                            <div className="h-px flex-1 bg-coffee-200" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 opacity-80 gap-6 md:gap-8">
                            {past.map((event: IEvent, index: number) => (
                                <div key={event._id.toString()}>
                                    <EventCard event={event} index={index} />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </section>
        </main>
    );
}

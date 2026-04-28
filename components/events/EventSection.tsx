import { EventCard } from "./EventCard";
import { Button } from "../ui/button";
import Link from "next/link";
import { IconArrowRight, IconChevronRight } from "@tabler/icons-react";
import { ArrowRight } from "lucide-react";
import { IEvent } from "@/lib/types/events";

export default function EventSection({ events }: { events: IEvent[] }) {
    const today = new Date().toISOString().split("T")[0];

    const upcomingEvents = events
        .filter(
            (event: IEvent) =>
                new Date(event.date).toISOString().split("T")[0] >= today
        )
        .slice(0, 3);

    if (!events || events.length === 0) {
        return (
            <section className="py-20 text-center">
                <h2 className="text-3xl font-bold mb-4 text-coffee-900">
                    Prochains Évènements
                </h2>
                <p className="text-muted-foreground">
                    Pas d'évènements prévus pour le moment. Revenez bientôt ! ☕
                </p>
            </section>
        );
    }

    return (
        <section className="py-20 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                    <h2 className="text-4xl md:text-5xl font-title text-primary mb-8">
                        On se voit quand ?
                    </h2>
                    <p className="text-lg font-body text-muted-foreground max-w-2xl">
                        Ateliers café, concerts acoustiques et moments de
                        partage au cœur de Béthune.
                    </p>
                </div>
                <div className="hidden md:block">
                    <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold">
                        {events.length} évènements à venir
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event: any, index: number) => (
                    <EventCard key={event._id} event={event} index={index} />
                ))}
            </div>

            <div className="w-full flex items-center justify-end mt-10">
                <Link
                    href="/events"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                >
                    Découvrez tous les évènements
                    <IconArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                    />
                </Link>
            </div>
        </section>
    );
}

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { IconCalendar, IconClock, IconMapPin } from "@tabler/icons-react";
import Link from "next/link";
import { CATEGORY_LABELS } from "@/lib/constants/events";
import { IEvent } from "@/lib/types/events";

export function EventCard({
    event,
    index = 0,
}: {
    event: IEvent;
    index?: number;
}) {
    const date = new Date(event.date);

    return (
        <div className="group bg-card rounded-3xl border shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full">
            <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                    src={event.urlImage}
                    alt={event.title}
                    quality={75}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={index < 3}
                    className="object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className="bg-white/90 blur-backdrop text-black hover:bg-white">
                        {CATEGORY_LABELS[event.category]}
                    </Badge>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between gap-2 text-primary font-medium text-sm mb-3">
                    <div className="flex items-center gap-2">
                        <IconCalendar size={18} />
                        {date.toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </div>
                    {event.isFull ? (
                        <Badge
                            variant="secondary"
                            className="text-white uppercase"
                        >
                            Complet
                        </Badge>
                    ) : (
                        <span>
                            {event.capacity
                                ? `${event.capacity} places`
                                : "Ouvert au public"}
                        </span>
                    )}
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                    {event.title}
                </h3>

                <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
                    {event.shortDescription || event.description}
                </p>

                <div className="space-y-2 border-t pt-4">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <IconClock size={16} />
                            {event.startTime}{" "}
                            {event.endTime && `- ${event.endTime}`}
                        </div>
                        <span className="font-bold text-lg">
                            {event.price === 0 ? "Gratuit" : `${event.price}€`}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <IconMapPin size={16} />
                        {event.location || "Fresh Coffee, Béthune"}
                    </div>

                    <Link
                        href={`/events/${event.slug}`}
                        className={`w-full inline-flex justify-center items-center px-4 py-2 rounded-xl font-semibold transition-all ${
                            event.isFull
                                ? "bg-muted text-muted-foreground cursor-not-allowed"
                                : "bg-primary text-primary-foreground hover:opacity-90 shadow-md"
                        }`}
                    >
                        {event.isFull ? "Plus de places" : "Voir les détails"}
                    </Link>
                </div>
            </div>
        </div>
    );
}

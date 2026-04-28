import {
    Instagram,
    ExternalLink,
    MoreHorizontal,
    Heart,
    MessageCircle,
    Send,
    Bookmark,
} from "lucide-react";
import Image from "next/image";

const MOCK_POSTS = [
    {
        id: 1,
        url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
    },
    {
        id: 2,
        url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    },
    {
        id: 3,
        url: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=800&q=80",
    },
    {
        id: 4,
        url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80",
    },
    {
        id: 5,
        url: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=800&q=80",
    },
    {
        id: 6,
        url: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&q=80",
    },
];

export interface InstagramPost {
    id: string;
    media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
    media_url: string;
    permalink: string;
    caption?: string;
    timestamp: string;
}

export const MOCK_INSTAGRAM_POSTS: InstagramPost[] = [
    {
        id: "1",
        media_type: "IMAGE",
        media_url:
            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
        permalink: "#",
        caption:
            "Le secret d'un bon matin ? Un grain fraîchement torréfié et beaucoup d'amour. ✨",
        timestamp: "2024-03-17T10:00:00+0000",
    },
    {
        id: "2",
        media_type: "IMAGE",
        media_url:
            "https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=800&q=80",
        permalink: "#",
        caption:
            "Notre nouveau latte à l'avoine est enfin disponible. Une douceur incomparable. 🥛☕️",
        timestamp: "2024-03-16T15:00:00+0000",
    },
    {
        id: "3",
        media_type: "IMAGE",
        media_url:
            "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80",
        permalink: "#",
        caption:
            "L'art de la patience. Chaque extraction est une science chez Fresh Coffee. 🧪",
        timestamp: "2024-03-15T09:00:00+0000",
    },
];

export default function InstagramSection() {
    return (
        <section className="py-24 px-6 ">
            <div className="max-w-7xl mx-auto">
                {/* Header de la section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary">
                            <Instagram className="w-5 h-5" />
                            <span className="text-sm font-bold uppercase tracking-[0.2em]">
                                Social Feed
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-title text-primary">
                            Suivez l'art du café <br /> sur Instagram
                        </h2>
                    </div>

                    <a
                        href="https://instagram.com"
                        target="_blank"
                        className="group flex items-center gap-2 text-sm font-medium border-b border-primary/20 pb-1 hover:border-primary transition-all"
                    >
                        @freshcoffee_bethune
                        <ExternalLink className="w-4 h-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </a>
                </div>

                {/* Grille d'images aérée */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {MOCK_INSTAGRAM_POSTS.map((post) => (
                        <article
                            key={post.id}
                            className="bg-white border border-border rounded-lg overflow-hidden max-w-[470px] mx-auto w-full shadow-sm"
                        >
                            {/* HEADER DU POST */}
                            <div className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[1.5px]">
                                        <div className="relative w-full h-full rounded-full border-2 border-white overflow-hidden bg-muted">
                                            <Image
                                                src="/lat"
                                                alt="Profile"
                                                fill
                                                sizes="32px"
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[13px] font-bold leading-none hover:text-muted-foreground cursor-pointer">
                                            freshcoffee_bethune
                                        </span>
                                        <span className="text-[11px] text-muted-foreground">
                                            Béthune, France
                                        </span>
                                    </div>
                                </div>
                                <MoreHorizontal className="w-5 h-5 text-muted-foreground cursor-pointer" />
                            </div>

                            {/* IMAGE DU POST */}
                            <div className="aspect-square w-full bg-muted relative group">
                                <img
                                    src={post.media_url}
                                    alt="Post content"
                                    className="object-cover w-full h-full"
                                />
                            </div>

                            {/* ACTIONS (Like, Comment, Share, Save) */}
                            <div className="p-3 pb-1">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-4">
                                        <Heart className="w-6 h-6 hover:text-muted-foreground cursor-pointer transition-colors" />
                                        <MessageCircle className="w-6 h-6 hover:text-muted-foreground cursor-pointer transition-colors" />
                                        <Send className="w-6 h-6 hover:text-muted-foreground cursor-pointer transition-colors" />
                                    </div>
                                    <Bookmark className="w-6 h-6 hover:text-muted-foreground cursor-pointer transition-colors" />
                                </div>

                                {/* LIKE COUNT */}
                                <p className="text-[13px] font-bold mb-2">
                                    0 J'aime
                                </p>

                                {/* CAPTION (Légende) */}
                                <div className="text-[13px] leading-relaxed mb-2">
                                    <span className="font-bold mr-2 text-primary">
                                        freshcoffee_bethune
                                    </span>
                                    <span className="text-foreground/90">
                                        {post.caption}
                                    </span>
                                </div>

                                {/* DATE */}
                                <time className="text-[10px] text-muted-foreground uppercase tracking-wide">
                                    IL Y A 2 HEURES
                                </time>
                            </div>

                            {/* BARRE DE COMMENTAIRE (Fictive) */}
                            <div className="border-t border-border mt-3 p-3 hidden sm:flex items-center justify-between">
                                <input
                                    type="text"
                                    placeholder="Ajouter un commentaire..."
                                    className="text-[13px] w-full bg-transparent focus:outline-none placeholder:text-muted-foreground"
                                    disabled
                                />
                                <button className="text-primary/50 text-sm font-bold cursor-default">
                                    Publier
                                </button>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Petit texte discret en bas */}
                <p className="text-center mt-16 text-muted-foreground text-sm italic">
                    Partagez vos moments avec le hashtag{" "}
                    <span className="text-primary font-semibold">
                        #FreshCoffeeBethune
                    </span>
                </p>
            </div>
        </section>
    );
}

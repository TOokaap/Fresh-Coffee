import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    IconCoffeeOff,
    IconChevronLeft,
    IconHome,
    IconCalendar,
} from "@tabler/icons-react";

export default function NotFound() {
    return (
        <main className="min-h-[100vh] flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center space-y-8">
                <div className="relative inline-flex items-center justify-center">
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground font-black px-4 py-2 rounded-2xl rotate-12 text-xl shadow-lg">
                        404
                    </span>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black text-primary tracking-tighter uppercase">
                        Tasse{" "}
                        <span className="text-primary italic font-serif">
                            vide !
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-md mx-auto leading-relaxed">
                        On dirait que cette page a été bue jusqu'à la dernière
                        goutte ou qu'elle n'a jamais existé.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                    <Button
                        asChild
                        size="lg"
                        className="rounded-2xl px-8 h-14 text-base font-bold shadow-xl shadow-primary/20"
                    >
                        <Link href="/">
                            <IconHome className="mr-2" size={20} />
                            Retour à l'accueil
                        </Link>
                    </Button>
                </div>
            </div>
        </main>
    );
}

import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

interface Props {
    searchParams: Promise<{ token?: string }>;
}

export default async function VerifyReservationPage({ searchParams }: Props) {
    const { token } = await searchParams;

    if (!token) {
        return <VerifyResult success={false} error="Lien invalide." />;
    }

    const res = await fetch(
        `${process.env.DASHBOARD_API_URL}/api/v1/reservations/verify?token=${token}`,
        { cache: "no-store" }
    );

    const data = await res.json();

    return <VerifyResult success={data.success} error={data.error} />;
}

function VerifyResult({
    success,
    error,
}: {
    success: boolean;
    error?: string;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center flex flex-col items-center gap-6">
                {success ? (
                    <>
                        <CheckCircle className="w-16 h-16 text-primary" />
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl font-semibold">
                                Email confirmé !
                            </h1>
                            <p className="text-muted-foreground">
                                Votre demande de réservation a bien été
                                transmise. Vous recevrez un email de
                                confirmation dès que nous aurons validé votre
                                réservation.
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <XCircle className="w-16 h-16 text-destructive" />
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl font-semibold">
                                Lien invalide
                            </h1>
                            <p className="text-muted-foreground">
                                {error ??
                                    "Ce lien est invalide ou a expiré. Veuillez refaire une demande de réservation."}
                            </p>
                        </div>
                    </>
                )}
                <Button asChild variant="outline">
                    <Link href="/">Retour à l'accueil</Link>
                </Button>
            </div>
        </div>
    );
}

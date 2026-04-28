"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({ password }),
        });
        if (res.ok) {
            router.push("/");
        } else {
            setError(true);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
                <h1 className="text-xl font-bold">Accès privé</h1>
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border rounded px-3 py-2"
                />
                {error && (
                    <p className="text-red-500 text-sm">
                        Mot de passe incorrect
                    </p>
                )}
                <button
                    type="submit"
                    className="bg-black text-white rounded py-2"
                >
                    Entrer
                </button>
            </form>
        </div>
    );
}

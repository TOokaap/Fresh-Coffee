import { createClient } from "@supabase/supabase-js";

// Utilisation de la clé ANON ici car on l'utilise côté client
export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const uploadToSupabase = async (
    file: File,
    folder: "news" | "gallery" | "events" | "menu"
): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from("news-images") // Nom de ton bucket public
        .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
        .from("news-images")
        .getPublicUrl(filePath);
    return data.publicUrl;
};

// Connexion mongodb

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error(
        "Veuillez définir la variable d'environnement MONGODB_URI dans votre fichier .env"
    );
}

/** * Global est utilisé ici pour maintenir une connexion cache à travers
 * les rechargements de "hot reload" en développement.
 */
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose
            .connect(MONGODB_URI!, opts)
            .then((mongoose) => {
                console.log("✅ Connexion à MongoDB établie");
                return mongoose;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectDB;

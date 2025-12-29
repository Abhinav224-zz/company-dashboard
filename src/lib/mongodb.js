import mongoose from "mongoose";

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "Missing MONGODB_URI. Please define it in your Vercel Project Settings (Environment Variables) or in a local .env.local file."
    );
  }
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const options = {
      dbName: process.env.MONGODB_DB || "company_dashboard",
      serverSelectionTimeoutMS: 10000,
      family: 4,
    };

    cached.promise = mongoose
      .connect(uri, options)
      .then((mongooseInstance) => mongooseInstance)
      .catch((err) => {
        console.error("[MongoDB] Connection error:", err?.message);
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

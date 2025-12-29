import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Missing MONGODB_URI. Please define it in your .env.local (MongoDB Atlas connection string)."
  );
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const options = {
      dbName: process.env.MONGODB_DB || "company_dashboard",
      serverSelectionTimeoutMS: 10000,
      family: 4,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, options)
      .then((mongooseInstance) => mongooseInstance)
      .catch((err) => {
        console.error("[MongoDB] Connection error:", err?.message);
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

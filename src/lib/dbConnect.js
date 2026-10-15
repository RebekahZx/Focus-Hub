import mongoose from "mongoose";

// Reuse one connection across hot reloads and serverless invocations.
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export default async function dbConnect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set. See .env.example.");
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { bufferCommands: false, serverSelectionTimeoutMS: 5000 });
  }
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // allow a retry on the next request
    throw error;
  }
  return cached.conn;
}

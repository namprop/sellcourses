import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var __mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global.__mongooseCache || {
  conn: null,
  promise: null,
};

global.__mongooseCache = cache;

export async function connect() {
  if (!process.env.MONGO_URI) {
    throw new Error("Please define MONGO_URI in .env.local or environment variables");
  }
  
  const MONGO_URI = process.env.MONGO_URI;

  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGO_URI).then((m) => m);
  }

  cache.conn = await cache.promise;
  return cache.conn;
}

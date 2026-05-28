import mongoose from "mongoose";
import { env } from "@/lib/env";

declare global {
  var mongooseConnection:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const mongoOptions = {
  dbName: "trustlab",
  bufferCommands: false,
  maxPoolSize: 10,
} as const;

function getCache() {
  if (!global.mongooseConnection) {
    global.mongooseConnection = { conn: null, promise: null };
  }
  return global.mongooseConnection;
}

export function isDetachedBufferError(error: unknown) {
  return (
    error instanceof Error &&
    (error.message.includes("detached ArrayBuffer") ||
      error.message.includes("detached buffer"))
  );
}

export async function resetDbConnection() {
  const cache = getCache();
  cache.conn = null;
  cache.promise = null;
  if (mongoose.connection.readyState !== 0) {
    try {
      await mongoose.disconnect();
    } catch {
      // ignore disconnect errors during reset
    }
  }
}

async function connectToDbInternal() {
  const cache = getCache();

  if (cache.conn && mongoose.connection.readyState === 1) {
    return cache.conn;
  }

  if (cache.conn && mongoose.connection.readyState !== 1) {
    await resetDbConnection();
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(env.mongodbUri, mongoOptions);
  }

  try {
    cache.conn = await cache.promise;
  } catch (error) {
    cache.promise = null;
    cache.conn = null;
    throw error;
  }

  return cache.conn;
}

export async function connectToDb() {
  return connectToDbInternal();
}

/** Run a DB operation; reconnect once if Turbopack/RSC detached the driver buffer. */
export async function dbQuery<T>(operation: () => Promise<T>): Promise<T> {
  for (let attempt = 0; attempt < 2; attempt++) {
    await connectToDbInternal();
    try {
      return await operation();
    } catch (error) {
      if (attempt === 0 && isDetachedBufferError(error)) {
        await resetDbConnection();
        continue;
      }
      throw error;
    }
  }

  throw new Error("Database operation failed after retry.");
}

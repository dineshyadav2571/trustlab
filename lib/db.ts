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

const globalConnection = global.mongooseConnection ?? {
  conn: null,
  promise: null,
};

export async function connectToDb() {
  if (globalConnection.conn) {
    return globalConnection.conn;
  }

  if (!globalConnection.promise) {
    globalConnection.promise = mongoose.connect(env.mongodbUri, {
      dbName: "trustlab",
    });
  }

  globalConnection.conn = await globalConnection.promise;
  global.mongooseConnection = globalConnection;

  return globalConnection.conn;
}

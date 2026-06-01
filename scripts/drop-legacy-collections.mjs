/**
 * Drops MongoDB collections for removed site modules.
 * Safe to run multiple times. Does not touch active collections.
 *
 * Usage: npm run db:drop-legacy
 */
import mongoose from "mongoose";

/** Matches Mongoose default collection names and common variants. */
const LEGACY_PATTERN =
  /^(patents|achievements|newshighlights|news_highlights|opportunities|collaborations|researchareas|research_areas|peoples|people)$/i;

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set (use --env-file=.env.local).");
  process.exit(1);
}

await mongoose.connect(uri);
const db = mongoose.connection.db;
const collections = await db.listCollections().toArray();

let dropped = 0;
for (const { name } of collections) {
  if (!LEGACY_PATTERN.test(name)) continue;
  await db.dropCollection(name);
  console.log(`dropped ${name}`);
  dropped += 1;
}
if (!dropped) console.log("No legacy collections found on this database.");

await mongoose.disconnect();
console.log("Done.");

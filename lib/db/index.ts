import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// DATABASE_URL is available at runtime (not during `next build` static analysis).
// Using a fallback empty string lets the module load without error at build time;
// actual queries will fail gracefully if no real URL is provided.
const sql = neon(process.env.DATABASE_URL ?? "postgresql://placeholder:placeholder@placeholder.neon.tech/placeholder");
export const db = drizzle(sql, { schema });

export * from "./schema";

import { neon } from "@neondatabase/serverless";

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }

  return url;
}

export function getDb() {
  return neon(getDatabaseUrl());
}

export async function checkDatabaseConnection() {
  const sql = getDb();
  const result = await sql`SELECT 1 AS connected`;
  return result[0]?.connected === 1;
}

import type { DB } from "@/lib/types";
import { MAX_STAGGER } from "./consts";

const STORAGE_KEY = "event-checkin-db";
export const EMPTY_DB: DB = { attendees: [], checkedIn: [] };

export function loadDB(): DB {
  if (typeof window === "undefined") return EMPTY_DB;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DB) : EMPTY_DB;
  } catch {
    return EMPTY_DB;
  }
}

export function saveDB(db: DB): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (e) {
    console.error("Storage save error:", e);
  }
}

export function genCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

export function formatTime(d: Date): string {
  return [d.getHours(), d.getMinutes(), d.getSeconds()]
    .map((n) => n.toString().padStart(2, "0"))
    .join(":");
}

export function getStaggerDelay(index: number): string {
  const clamped = Math.min(index, MAX_STAGGER - 1);
  return `${(clamped * 0.04).toFixed(2)}s`;
}
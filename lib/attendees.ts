import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import { getDb } from "@/lib/database";
import { genCode } from "@/lib/helpers";
import type { Attendee, DB } from "@/lib/types";

type AttendeeRow = {
  code: string;
  org_name: string;
  name: string;
  email: string | null;
  registered_at: string | Date;
  checked_in: boolean;
  checked_in_at: string | Date | null;
};

let tableEnsured = false;

function mapAttendee(row: AttendeeRow): Attendee {
  return {
    code: row.code,
    orgName: row.org_name ?? "",
    name: row.name,
    phone: row.email ?? "",
    registered: new Date(row.registered_at).toISOString(),
    checkedIn: row.checked_in,
    checkedInAt: row.checked_in_at ? new Date(row.checked_in_at).toISOString() : null,
  };
}

function asAttendeeRows(rows: Record<string, unknown>[]): AttendeeRow[] {
  return rows as AttendeeRow[];
}

export async function ensureAttendeesTable() {
  if (tableEnsured) return;

  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS attendees (
      id BIGSERIAL PRIMARY KEY,
      code VARCHAR(6) NOT NULL UNIQUE,
      org_name TEXT NOT NULL DEFAULT '',
      name TEXT NOT NULL,
      email TEXT NOT NULL DEFAULT '',
      registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      checked_in BOOLEAN NOT NULL DEFAULT FALSE,
      checked_in_at TIMESTAMPTZ NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE attendees ADD COLUMN IF NOT EXISTS org_name TEXT NOT NULL DEFAULT ''`;
  await sql`
    CREATE INDEX IF NOT EXISTS attendees_checked_in_idx ON attendees (checked_in)
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS attendees_registered_at_idx ON attendees (registered_at DESC)
  `;

  tableEnsured = true;
}

export async function getAttendeesDb(): Promise<DB> {
  noStore();
  await ensureAttendeesTable();

  const sql = getDb();
  const rows = asAttendeeRows(await sql`
    SELECT code, org_name, name, email, registered_at, checked_in, checked_in_at
    FROM attendees
    ORDER BY registered_at ASC, code ASC
  `);

  const attendees = rows.map(mapAttendee);
  return {
    attendees,
    checkedIn: attendees.filter((attendee) => attendee.checkedIn).map((attendee) => attendee.code),
  };
}

export async function createAttendee(input: { orgName: string; name: string; phone: string }) {
  await ensureAttendeesTable();

  const sql = getDb();
  const orgName = input.orgName.trim();
  const name = input.name.trim();
  const phone = input.phone.trim();

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const code = genCode();

    try {
      await sql`
        INSERT INTO attendees (code, org_name, name, email, registered_at, checked_in, checked_in_at, updated_at)
        VALUES (${code}, ${orgName}, ${name}, ${phone}, NOW(), FALSE, NULL, NOW())
      `;
      return code;
    } catch (error) {
      if ((error as { code?: string }).code === "23505") {
        continue;
      }
      throw error;
    }
  }

  throw new Error("Could not generate a unique attendee code");
}

export async function bulkCreateAttendees(entries: Array<{ orgName: string; name: string; phone: string }>) {
  for (const entry of entries) {
    const trimmedName = entry.name.trim();
    if (!trimmedName) continue;
    await createAttendee({ orgName: entry.orgName.trim(), name: trimmedName, phone: entry.phone.trim() });
  }
}

export async function toggleAttendeeCheckin(code: string) {
  await ensureAttendeesTable();
  const sql = getDb();

  await sql`
    UPDATE attendees
    SET
      checked_in = NOT checked_in,
      checked_in_at = CASE WHEN checked_in THEN NULL ELSE NOW() END,
      updated_at = NOW()
    WHERE code = ${code}
  `;
}

export async function deleteAttendee(code: string) {
  await ensureAttendeesTable();
  const sql = getDb();

  await sql`DELETE FROM attendees WHERE code = ${code}`;
}

export async function clearAttendees() {
  await ensureAttendeesTable();
  const sql = getDb();

  await sql`TRUNCATE TABLE attendees RESTART IDENTITY`;
}

export async function checkInAttendeeByCode(code: string) {
  await ensureAttendeesTable();
  const sql = getDb();

  const rows = asAttendeeRows(await sql`
    SELECT code, org_name, name, email, registered_at, checked_in, checked_in_at
    FROM attendees
    WHERE UPPER(code) = UPPER(${code})
    LIMIT 1
  `);

  const found = rows[0];
  if (!found) {
    return { status: "not_found" as const };
  }

  if (found.checked_in) {
    return { status: "already" as const, attendee: mapAttendee(found) };
  }

  const updatedRows = asAttendeeRows(await sql`
    UPDATE attendees
    SET checked_in = TRUE, checked_in_at = NOW(), updated_at = NOW()
    WHERE code = ${found.code}
    RETURNING code, org_name, name, email, registered_at, checked_in, checked_in_at
  `);

  return { status: "success" as const, attendee: mapAttendee(updatedRows[0]) };
}

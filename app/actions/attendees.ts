"use server";

import { revalidatePath } from "next/cache";
import {
  bulkCreateAttendees,
  checkInAttendeeByCode,
  clearAttendees,
  createAttendee,
  deleteAttendee,
  getAttendeesDb,
  toggleAttendeeCheckin,
} from "@/lib/attendees";
import type { CheckInActionResult, MutateDbResult } from "@/lib/types";

function revalidateAttendeePages() {
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function addAttendeeAction(input: { orgName: string; name: string; phone: string }): Promise<MutateDbResult> {
  const trimmedName = input.name.trim();
  if (!trimmedName) {
    return { db: await getAttendeesDb(), code: null };
  }

  const code = await createAttendee({ orgName: input.orgName.trim(), name: trimmedName, phone: input.phone.trim() });
  revalidateAttendeePages();

  return { db: await getAttendeesDb(), code };
}

export async function addBulkAttendeesAction(rawBulk: string): Promise<MutateDbResult> {
  const entries = rawBulk
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => {
      const parts = line.split(",").map((segment) => segment.trim());
      const [orgName = "", name = "", phone = ""] = parts;
      return { orgName, name, phone };
    });

  await bulkCreateAttendees(entries);
  revalidateAttendeePages();

  return { db: await getAttendeesDb() };
}

export async function toggleAttendeeCheckinAction(code: string): Promise<MutateDbResult> {
  await toggleAttendeeCheckin(code);
  revalidateAttendeePages();
  return { db: await getAttendeesDb() };
}

export async function removeAttendeeAction(code: string): Promise<MutateDbResult> {
  await deleteAttendee(code);
  revalidateAttendeePages();
  return { db: await getAttendeesDb() };
}

export async function resetAttendeesAction(): Promise<MutateDbResult> {
  await clearAttendees();
  revalidateAttendeePages();
  return { db: await getAttendeesDb() };
}

export async function checkInByCodeAction(code: string): Promise<CheckInActionResult> {
  const normalizedCode = code.trim().toUpperCase();
  const result = await checkInAttendeeByCode(normalizedCode);
  const db = await getAttendeesDb();
  revalidateAttendeePages();

  if (result.status === "not_found") {
    return {
      db,
      status: "error",
      errMsg: "Код олдсонгүй",
      foundOrgName: "",
      foundName: "",
    };
  }

  if (result.status === "already") {
    return {
      db,
      status: "already",
      errMsg: "Аль хэдийн бүртгэгдсэн",
      foundOrgName: result.attendee?.orgName ?? "",
      foundName: result.attendee?.name ?? "",
    };
  }

  return {
    db,
    status: "success",
    errMsg: "",
    foundOrgName: result.attendee?.orgName ?? "",
    foundName: result.attendee?.name ?? "",
  };
}

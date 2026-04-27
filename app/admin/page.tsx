import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminPanel } from "@/components/adminPanel";
import { getAttendeesDb } from "@/lib/attendees";
import { verifySession } from "@/lib/auth";

export default async function AdminPage() {
  const store = await cookies();
  const token = store.get("admin_auth")?.value;

  if (!verifySession(token)) {
    redirect("/admin/login");
  }

  const initialDb = await getAttendeesDb();
  return <AdminPanel initialDb={initialDb} />;
}

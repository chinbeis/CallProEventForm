import EventCheckin from "@/components/EventCheckIn";
import { getAttendeesDb } from "@/lib/attendees";

export default async function CheckinPage() {
  const initialDb = await getAttendeesDb();
  return <EventCheckin initialDb={initialDb} />;
}

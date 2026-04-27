export interface Attendee {
  code: string;
  orgName: string;
  name: string;
  phone: string;
  registered: string;
  checkedIn: boolean;
  checkedInAt: string | null;
}

export interface DB {
  attendees: Attendee[];
  checkedIn: string[];
}

export type Status = null | "success" | "error" | "already";

export interface StatusOverlayProps {
  status: Status;
  foundOrgName: string;
  foundName: string;
  errMsg: string;
}

export interface EventCheckinProps {
  initialDb: DB;
}

export interface AdminPanelProps {
  initialDb: DB;
}

export type StatCard = {
  label: string;
  value: number;
  valueColor: string;
};

export interface CheckInActionResult {
  db: DB;
  status: Status;
  errMsg: string;
  foundOrgName: string;
  foundName: string;
}

export interface MutateDbResult {
  db: DB;
  code?: string | null;
}

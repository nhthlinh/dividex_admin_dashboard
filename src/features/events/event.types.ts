import type { Group } from "../groups/group.types";
import type { User } from "../users/user.types";

export interface Event {
  uid: string;
  name: string;
  name_no_accent?: string;
  creator: User;
  group_uid: string;
  group_name: string;
  group: Group;
  description?: string;
  event_start: string; // Date string
  event_end: string; // Date string
  created_at: string;
  status: "ACTIVE" | "INACTIVE" | "COMPLETED" | "CANCELLED";
}

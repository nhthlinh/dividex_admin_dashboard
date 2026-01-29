import type { GroupItem } from "../groups/group.types";
import type { User } from "../users/user.types";

export interface EventStatistics {
  total_events: number;
  total_members: number;
  active_events: number;
  total_finished_events: number;
  percent_increase_events: number;
  percent_increase_members: number;
  percent_increase_active_events: number;
  percent_increase_finished_events: number;
}

export interface EventItem {
  event_uid: string;
  event_name: string;
  event_description: string;
  event_start: string; // yyyy-mm-dd
  event_end: string;   // yyyy-mm-dd
  status: string;
  creator: User;
  group: GroupItem;
}

export interface EventListResponse {
  content: EventItem[];
  current_page: number;
  page_size: number;
  total_rows: number;
  total_pages: number;
}

export interface EventMember {
  event_member_uid: string;
  status: string;
  user: User;
}

export interface EventMemberListResponse {
  content: EventMember[];
  current_page: number;
  page_size: number;
  total_rows: number;
  total_pages: number;
}

export interface ExpenseSimple {
  expense_uid: string;
  amount: number;
  currency: string;
  created_at: string;
  paid_by: User;
  name: string;
}

export interface ExpenseSimpleListResponse {
  expenses: ExpenseSimple[];
  total_amount: number;
}
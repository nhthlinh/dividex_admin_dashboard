import type { User } from "../users/user.types";

export interface GroupStatistics {
  total_groups: number;
  total_members: number;
  active_groups: number;
  percent_increase_groups: number;
  percent_increase_members: number;
  percent_increase_active_groups: number;
}

export interface GroupItem {
  uid: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  created_at: string;
  total_members: number;
  leader: User;
    avatar_url: {
    uid: string,
    original_name?: string,
    public_url?: string
  },
}

export interface GroupListResponse {
  content: GroupItem[];
  current_page: number;
  page_size: number;
  total_rows: number;
  total_pages: number;
}

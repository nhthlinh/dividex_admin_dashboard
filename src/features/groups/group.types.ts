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

export interface GroupMember {
  group_members_uid: string;
  user: {
    full_name: string;
    email: string;
    balance: number;
    avatar_url: any; // hoặc string | null tùy BE
    uid: string;
  };
  joined_at: string;
}

export interface GroupMembersResponse {
  content: GroupMember[];
  current_page: number;
  page_size: number;
  total_rows: number;
  total_pages: number;
}

export interface GetGroupMembersParams {
  search?: string | null;
  order_by?: "updated_at" | "full_name";
  sort_type?: "asc" | "desc";
  page_size?: number;
  page?: number;
}
import type { PaginationParams, PaginationResponse, User } from "../users/user.types";

export interface NotificationStats {
  total_notifications: number;
  total_users: number;
  notifications_today: number;
  percent_increase_notifications_today: number;
  percent_increase_total_notifications: number;
  percent_increase_users: number;
}

export interface NotificationItem {
  uid: string;
  created_at: string;
  content: string;
  type: "System" | "Warning" | "Announcement" | "Reminder";
  related_uid: string | null;
  from_user: User;
  to_users: User[];
  is_broadcast: boolean;
}

export type NotificationListResponse =
  PaginationResponse<NotificationItem>;

export interface NotificationListParams extends PaginationParams {
  search?: string;
  type?: "System" | "Warning" | "Announcement" | "Reminder";
}

export interface CreateNotificationPayload {
  related_uid?: string | null;
  content: string;
  type: "System" | "Warning" | "Announcement" | "Reminder";
  to_user_uids: string[];
  is_broadcast: boolean;
}
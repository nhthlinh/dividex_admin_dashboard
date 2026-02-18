import type { User } from "../users/user.types";

export type NotificationType = 
  | "SYSTEM" 
  | "EVENT" 
  | "EXPENSE" 
  | "PAYMENT" 
  | "GROUP" 
  | "MESSAGE"
  | "ANNOUNCEMENT"
  | "REMINDER"
  | "WARNING";

export type NotificationStatus = "UNREAD" | "READ" | "ARCHIVED";

export interface Notification {
  uid: string;
  from_user: User;
  content: string;
  type: NotificationType;
  related_uid?: string;
  to_users: User[];
  created_at: string;
  status?: NotificationStatus;
  is_broadcast?: boolean;
}

export interface CreateNotificationRequest {
  content: string;
  type: NotificationType;
  related_uid?: string;
  to_user_uids?: string[];
  is_broadcast?: boolean;
}

import type { Group } from "../groups/group.types";
import type { User } from "../users/user.types";

export type MessageStatus = "ACTIVE" | "DELETED" | "EDITED";

export interface MessageAttachment {
  uid: string;
  url: string;
  name: string;
  type: string;
  size: string;
}

export interface Message {
  uid: string;
  content: string;
  attachments?: MessageAttachment[];
  user: User;
  status: MessageStatus;
  group_uid: string;
  group_name: string;
  group_avatar_url?: {
    uid: string;
    original_name?: string;
    public_url?: string;
  };
  created_at: string;
  updated_at?: string;
  is_pinned?: boolean;
}

export interface GroupConversation {
  group_uid: string;
  group_name: string;
  group_avatar_url?: {
    uid: string;
    original_name?: string;
    public_url?: string;
  };
  last_message?: Message;
  message_count: number;
  unread_count?: number;
  participants: User[];
}

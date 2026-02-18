import type { User } from "../users/user.types";

export type MessageStatus = "ACTIVE" | "DELETED" | "EDITED";

export interface MessageAttachment {
  uid: string;
  public_url: string;
  original_name: string;
}

export interface Message {
  uid: string;
  sender: User;
  content: string;
  attachments?: MessageAttachment[];
  status: MessageStatus;
  created_at: string;
  updated_at?: string;
}

export interface MessageGroupItem {
  uid: string;
  group_name: string;
  total_members: number;
  total_messages: number;
  total_messages_unread: number;
  last_message: string;
  last_message_content: string;
}

export interface MessageGroupListResponse {
  content: MessageGroupItem[];
  current_page: number;
  page_size: number;
  total_rows: number;
  total_pages: number;
}

export interface MessageManagement {
  total_messages: number;
  active_groups: number;
  message_today: number;
  attachments: number;

  percent_increase_messages: number;
  percent_increase_active_groups: number;
  percent_increase_message_today: number;
  percent_increase_attachments: number;
}

export interface MessagesInGroupItem {
  name: string;
  total_members: number;
  total_messages: number;
  messages: Message[]; 
  avatar_url?: string;
}

export interface MessagesInGroupResponse {
  content: MessagesInGroupItem[];
  current_page: number;
  page_size: number;
  total_rows: number;
  total_pages: number;
}

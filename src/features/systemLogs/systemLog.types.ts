import type { User } from "../users/user.types";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface SystemLogItem {
  uid: string;
  user: User;
  created_at: string;
  updated_at: string;
  path: string;
  method_type: HttpMethod;
  status_code: number;
  response_time: number;
  log_message: string;
}

export interface SystemLogListResponse {
  content: SystemLogItem[];
  current_page: number;
  page_size: number;
  total_rows: number;
  total_pages: number;
}

export interface GetSystemLogsParams {
  method_type?: HttpMethod | null;
  status_code?: "2xx" | "4xx" | "5xx" | null;
  search?: string;
  page_size?: number;
  page?: number;
}

export interface ManagementLogResponse {
  total_errors: number;
  percent_increase_errors: number;
  today_errors: number;
  percent_increase_today_errors: number;
  avg_response_time: number;
  percent_increase_avg_response_time: number;
}
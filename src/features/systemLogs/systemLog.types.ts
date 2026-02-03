import type { User } from "../users/user.types";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type LogLevel = "INFO" | "WARNING" | "ERROR" | "CRITICAL";

export interface SystemLog {
  uid: string;
  api_endpoint: string;
  http_method: HttpMethod;
  status_code: number;
  error_message?: string;
  error_type?: string;
  user?: User;
  ip_address?: string;
  user_agent?: string;
  request_body?: any;
  response_body?: any;
  stack_trace?: string;
  execution_time?: number; // in milliseconds
  timestamp: string;
  log_level: LogLevel;
}

export interface ErrorStats {
  total_errors: number;
  errors_today: number;
  critical_errors: number;
  avg_response_time: number;
  top_error_endpoint?: string;
}

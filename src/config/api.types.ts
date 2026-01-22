export interface ApiResponse<T = any> {
  data: T;
  error_code: string | null;
  message: string;
  message_code: string;
  current_time: string;
}

export interface User {
  avatar_url: {
    uid: string,
    original_name?: string,
    public_url?: string
  },
  email: string,
  full_name: string,
  phone_number?: string,
  uid: string,
  balance?: number,
  role?: string
}

export interface ListUsersParams {
  search?: string;
  order_by?: "balance" | "full_name" | "updated_at";
  sort_type?: "asc" | "desc";
  page?: number;
  page_size?: number;
}

export interface ListUsersData {
  content: User[];
  current_page: number;
  page_size: number;
  total_rows: number;
  total_pages: number;
}

export interface UserDetail {
  uid: string;
  email: string;
  full_name: string;
  phone_number: string;
  status: boolean;
  joined: string;
  role: string;
  total_expenses: number;
  total_groups: number;
  total_balance: number;
  last_login: string;
  avatar_url?: {
    uid: string;
    original_name: string;
    public_url: string;
  };
}

export interface UserGroup {
  group_uid: string;
  group_name: string;
  role: string;
  joined_at: string;
}

export interface UserExpense {
  expense_uid: string;
  name: string;
  amount: number;
  currency: string;
  expense_date: string;
  end_date: string;
}

export interface PaginationParams {
  search?: string;
  page?: number;
  page_size?: number;
}

export interface PaginationResponse<T> {
  content: T[];
  current_page: number;
  page_size: number;
  total_rows: number;
  total_pages: number;
}

export interface UserLoginHistoryItem {
  uid: string;
  created_at: string;
  user: string;
  platform: string;
  divice_model: string;
  os_version: string;
  app_version: string;
  location: string;
}

export type UserLoginHistoryResponse =
  PaginationResponse<UserLoginHistoryItem>;

export interface SearchUserItem {
  uid: string;
  full_name: string;
  email: string;
  balance: number;
  avatar_url: unknown;
  status: string;
  date_joined: string;
}

export type SearchUserResponse =
  PaginationResponse<SearchUserItem>;

export interface SearchUserParams extends PaginationParams {
  search: string;
}

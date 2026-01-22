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
import type { User } from "../users/user.types";

export type CurrencyType = "USD" | "VND" | "EUR" | "GBP" | "JPY";
export type SplitType = "EQUAL" | "PERCENTAGE" | "EXACT" | "SHARE";
export type ExpenseStatus = "ACTIVE" | "INACTIVE" | "SETTLED" | "CANCELLED";

export interface Expense {
  uid: string;
  name: string;
  category?: string;
  currency: CurrencyType;
  total_amount: number;

  event: {
    uid: string;
    name: string;
  };

  paid_by: User;
  creator: User;

  split_type: SplitType;
  note?: string;
  expense_date: string;

  status: ExpenseStatus;
}

export interface ExpenseListResponse {
  content: Expense[];
  current_page: number;
  page_size: number;
  total_rows: number;
  total_pages: number;
}

export interface ExpenseStatistics {
  total_expenses: number;
  total_avg_amount: number;
  active_expenses: number;
  total_expired_expenses: number;
  percent_increase_expenses: number;
  percent_increase_avg_amount: number;
  percent_increase_active_expenses: number;
  percent_increase_expired_expenses: number;
}

export interface SplitUserShare {
  user: User;
  amount: number;
}

export interface SplitExpenseResponse {
  total_amount: number;
  currency: string;
  split_type: string;
  list_user_shares: SplitUserShare[];
}

export interface ExpenseAttachment {
  uid: string;
  original_name: string;
  public_url: string;
  size: number;
  created_at: string;
}

export interface ExpenseAttachmentListResponse {
  content: ExpenseAttachment[];
  current_page: number;
  page_size: number;
  total_rows: number;
  total_pages: number;
}

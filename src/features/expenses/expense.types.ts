import type { User } from "../users/user.types";

export type CurrencyType = "USD" | "VND" | "EUR" | "GBP" | "JPY";
export type SplitType = "EQUAL" | "PERCENTAGE" | "EXACT" | "SHARE";
export type ExpenseStatus = "ACTIVE" | "INACTIVE" | "SETTLED" | "CANCELLED";

export interface Expense {
  uid: string;
  name: string;
  name_no_accent?: string;
  event_uid: string;
  event_name: string;
  currency: CurrencyType;
  total_amount: number;
  paid_by: User;
  creator: User;
  updated_by?: User;
  split_type: SplitType;
  note?: string;
  category?: string;
  expense_date: string;
  end_date?: string;
  receipt_urls?: string[];
  status: ExpenseStatus;
  created_at: string;
  updated_at: string;
}

export interface UserShare {
  uid: string;
  expense_uid: string;
  user: User;
  amount: number; // Amount this user owes
  receiver_amount: number; // Amount this user receives
  deleted: "ACTIVE" | "INACTIVE";
}

export interface ExpenseAttachment {
  uid: string;
  expense_uid: string;
  attachment_url: string;
  attachment_name: string;
  uploaded_at: string;
}

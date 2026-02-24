import type { PaginationParams, PaginationResponse, User } from "../users/user.types";

export interface TransactionStats {
  total_deposits: number;
  total_withdrawals: number;
  total_transactions: number;
  percent_increase_transactions: number;
  percent_increase_deposits: number;
  percent_increase_withdrawals: number;
}

export interface TransactionBankAccount {
  bank_name: string;
  account_number: string;
}

export interface TransactionItem {
  uid: string;
  type: "withdraw" | "deposit" | "transaction";
  amount: number;
  currency: string;
  created_at: string;
  code: string;
  user: User;
  bank_account: TransactionBankAccount | null;
  to_user: User | null;
  group_uid: string | null;
}

export type TransactionListResponse =
  PaginationResponse<TransactionItem>;

export interface TransactionListParams extends PaginationParams {
  search?: string;
  type?: "withdraw" | "deposit" | "transaction";
}
import type { CurrencyType } from "../expenses/expense.types";
import type { User } from "../users/user.types";

export type TransactionType = "DEPOSIT" | "WITHDRAW";
export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";

export interface WalletDeposit {
  uid: string;
  user: User;
  amount: number;
  currency: CurrencyType;
  created_at: string;
  code: string;
  status?: TransactionStatus;
}

export interface BankAccount {
  uid: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
  branch?: string;
}

export interface Withdraw {
  uid: string;
  bank_account: BankAccount;
  user: User;
  amount: number;
  code: string;
  created_at: string;
  status?: TransactionStatus;
}

export interface Transaction {
  uid: string;
  type: TransactionType;
  user: User;
  amount: number;
  currency?: CurrencyType;
  code: string;
  created_at: string;
  status: TransactionStatus;
  bank_account?: BankAccount;
}

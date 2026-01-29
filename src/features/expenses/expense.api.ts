import { api } from "../../config/api.config";
import type { ApiResponse } from "../../config/api.types";
import type { ExpenseListResponse, ExpenseStatistics } from "./expense.types";

export const ExpenseAPI = {
  getExpenseStatistics: async (): Promise<ExpenseStatistics> => {
    const res = await api.get<ApiResponse<ExpenseStatistics>>(
      "/admin/expense-management"
    );
    return res.data.data;
  },

  getExpenses: async (params?: {
    page?: number;
    page_size?: number;
  }): Promise<ExpenseListResponse> => {
    const res = await api.get<ApiResponse<ExpenseListResponse>>(
      "/admin/expenses",
      {
        params: {
          page: params?.page ?? 1,
          page_size: params?.page_size ?? 10,
        },
      }
    );

    return res.data.data;
  },

  deactivateExpense: async (expenseUid: string): Promise<void> => {
    await api.patch(`/admin/expense/deactivate/${expenseUid}`);
  },

  activateExpense: async (expenseUid: string): Promise<void> => {
    await api.patch(`/admin/expense/activate/${expenseUid}`);
  },
};

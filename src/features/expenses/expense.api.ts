/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../../config/api.config";
import { mockApi, USE_MOCK } from "../../services/mockApi";
import type { ApiResponse } from "../../config/api.types";
import type {
  ExpenseListResponse,
  ExpenseStatistics,
  SplitExpenseResponse,
  ExpenseAttachmentListResponse,
} from "./expense.types";

export const ExpenseAPI = {
  getExpenseStatistics: async (): Promise<ExpenseStatistics> => {
    if (USE_MOCK) {
      return { 
        total_expenses: 100,
        total_avg_amount: 1000,
        active_expenses: 80,
        total_expired_expenses: 20,
        percent_increase_expenses: 10,
        percent_increase_avg_amount: 5,
        percent_increase_active_expenses: 15,
        percent_increase_expired_expenses: -5
      } as ExpenseStatistics;
    }

    const res = await api.get<ApiResponse<ExpenseStatistics>>(
      "/admin/expense-management"
    );
    return res.data.data;
  },

  getExpenses: async (params?: {
    page?: number;
    page_size?: number;
  }): Promise<ExpenseListResponse> => {
    if (USE_MOCK) {
      return mockApi.listExpenses(params);
    }

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
    if (USE_MOCK) {
      await mockApi.deActivateExpense(expenseUid);
      return;
    }

    await api.patch(`/admin/expense/deactivate/${expenseUid}`);
  },

  activateExpense: async (expenseUid: string): Promise<void> => {
    if (USE_MOCK) {
      const expense = await mockApi.getExpenseDetail(expenseUid);
      expense.status = "ACTIVE";
      return;
    }

    await api.patch(`/admin/expense/active/${expenseUid}`);
  },

  getSplitExpense: async (
    expenseUid: string
  ): Promise<SplitExpenseResponse> => {
    if (USE_MOCK) {
      return mockApi.getExpenseDetail(expenseUid) as any;
    }

    const res = await api.get<ApiResponse<SplitExpenseResponse>>(
      `/admin/expenses/${expenseUid}`
    );
    return res.data.data;
  },

  getExpenseAttachments: async (
    expenseUid: string,
    params?: {
      page?: number;
      page_size?: number;
    }
  ): Promise<ExpenseAttachmentListResponse> => {
    if (USE_MOCK) {
      const attachments = await mockApi.getExpenseAttachments();
      return {
        content: attachments,
        current_page: params?.page ?? 1,
        page_size: params?.page_size ?? 10,
        total_rows: attachments.length,
        total_pages: 1,
      } as ExpenseAttachmentListResponse;
    }

    const res = await api.get<ApiResponse<ExpenseAttachmentListResponse>>(
      `/admin/expense/${expenseUid}/attachments`,
      {
        params: {
          page: params?.page ?? 1,
          page_size: params?.page_size ?? 10,
        },
      }
    );

    return res.data.data;
  },
};

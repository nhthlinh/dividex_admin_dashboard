import { api } from "../../config/api.config";
import { mockApi, USE_MOCK } from "../../services/mockApi";
import type { ApiResponse } from "../../config/api.types";
import type { TransactionListParams, TransactionListResponse, TransactionStats } from "./transaction.types";

export const TransactionAPI = {
  // Thống kê tổng quan giao dịch
  getTransactionStats: async (): Promise<TransactionStats> => {
    if (USE_MOCK) {
      return { 
        total_deposits: 400,
        total_withdrawals: 250,
        total_transactions: 650,
        percent_increase_transactions: 12,
        percent_increase_deposits: 8,
        percent_increase_withdrawals: 15
      } as TransactionStats;
    }

    const res = await api.get<ApiResponse<TransactionStats>>(
      "/admin/transactions-management"
    );
    return res.data.data;
  },

  // Danh sách nạp + rút tiền
  listTransactions: async (
    params: TransactionListParams = {}
  ): Promise<TransactionListResponse> => {
    if (USE_MOCK) {
      return mockApi.listTransactions(params);
    }

    const res = await api.get<ApiResponse<TransactionListResponse>>(
      "/admin/transactions",
      {
        params: {
          search: params.search,
          type: params.type,
          page: params.page ?? 1,
          page_size: params.page_size ?? 10,
        },
      }
    );

    return res.data.data;
  },
};

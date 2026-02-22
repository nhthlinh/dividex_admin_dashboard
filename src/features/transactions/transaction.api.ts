import { api } from "../../config/api.config";
import type { ApiResponse } from "../../config/api.types";
import type { TransactionListParams, TransactionListResponse, TransactionStats } from "./transaction.types";

export const TransactionAPI = {
  // Thống kê tổng quan giao dịch
  getTransactionStats: async (): Promise<TransactionStats> => {
    const res = await api.get<ApiResponse<TransactionStats>>(
      "/admin/transactions-management"
    );
    return res.data.data;
  },

  // Danh sách nạp + rút tiền
  listTransactions: async (
    params: TransactionListParams = {}
  ): Promise<TransactionListResponse> => {
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
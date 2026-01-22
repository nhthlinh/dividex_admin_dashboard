import { api } from "../../config/api.config"
import type { ApiResponse } from "../../config/api.types"
import type { ExpenseCategoryItem, TodayOverviewResponse, UserInsightItem } from "./dashboard.types"

export const DashboardAPI = {
  getTodayOverview: async (): Promise<TodayOverviewResponse> => {
    const res = await api.get<ApiResponse<TodayOverviewResponse>>(
      "/admin/today-overview"
    )
    return res.data.data
  },

  getUserInsights: async (): Promise<UserInsightItem[]> => {
    const res = await api.get<ApiResponse<UserInsightItem[]>>(
      `/admin/user-insights?year=${new Date().getFullYear()}`
    )
    return res.data.data
  },

  getExpenseCategories: async (): Promise<ExpenseCategoryItem[]> => {
    const res = await api.get<ApiResponse<ExpenseCategoryItem[]>>(
      "/admin/expense-categories"
    );
    return res.data.data;
  },

}

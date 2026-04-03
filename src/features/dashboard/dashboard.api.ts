import type { CashItem } from "../../components/CashFlowChart"
import { api } from "../../config/api.config"
import { mockApi, USE_MOCK } from "../../services/mockApi"
import type { ApiResponse } from "../../config/api.types"
import type { ExpenseCategoryItem, RatingItem, TodayOverviewResponse, UserInsightItem } from "./dashboard.types"

export const DashboardAPI = {
  getTodayOverview: async (): Promise<TodayOverviewResponse> => {
    if (USE_MOCK) {
      return mockApi.getTodayOverview();
    }

    const res = await api.get<ApiResponse<TodayOverviewResponse>>(
      "/admin/today-overview"
    )
    return res.data.data
  },

  getUserInsights: async (): Promise<UserInsightItem[]> => {
    if (USE_MOCK) {
      return mockApi.getUserInsights();
    }

    const res = await api.get<ApiResponse<UserInsightItem[]>>(
      `/admin/user-insights?year=${new Date().getFullYear()}`
    )
    return res.data.data
  },

  getExpenseCategories: async (): Promise<ExpenseCategoryItem[]> => {
    if (USE_MOCK) {
      return mockApi.getExpenseCategories();
    }

    const res = await api.get<ApiResponse<ExpenseCategoryItem[]>>(
      "/admin/expense-categories"
    );
    return res.data.data;
  },

  getCashData: async (): Promise<CashItem[]> => {
    if (USE_MOCK) {
      return mockApi.getCashData();
    }

    const res = await api.get<ApiResponse<CashItem[]>>(
      "/admin/cash-chart"
    );
    return res.data.data;
  },


  getRatings: async (start?: string, end?: string): Promise<RatingItem[]> => {
    if (USE_MOCK) {
      return mockApi.getRatings();
    }

    const res = await api.get<ApiResponse<RatingItem[]>>(
      "/admin/rating",
      {
        params: {
          start,
          end,
        },
      }
    );

    return res.data.data;
  },

}

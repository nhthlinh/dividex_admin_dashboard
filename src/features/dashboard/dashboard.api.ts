import { api } from "../../config/api.config"
import type { TodayOverviewResponse, UserInsightItem } from "./dashboard.types"

export const DashboardAPI = {
  getTodayOverview: async (): Promise<TodayOverviewResponse> => {
    const res = await api.get<TodayOverviewResponse>(
      "/api/admin/today-overview"
    )
    return res.data
  },

  getUserInsights: async (): Promise<UserInsightItem[]> => {
    const res = await api.get<UserInsightItem[]>(
      "/api/admin/user-insights"
    )
    return res.data
  },
}

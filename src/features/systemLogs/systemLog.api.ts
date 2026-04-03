import { api } from "../../config/api.config";
import { mockApi, USE_MOCK } from "../../services/mockApi";
import type { ApiResponse } from "../../config/api.types";
import type {
  SystemLogListResponse,
  GetSystemLogsParams,
  ManagementLogResponse,
} from "./systemLog.types";

export const SystemLogAPI = {
  getLogs: async (
    params?: GetSystemLogsParams
  ): Promise<SystemLogListResponse> => {
    if (USE_MOCK) {
      return mockApi.listSystemLogs(params);
    }

    const res = await api.get<ApiResponse<SystemLogListResponse>>(
      "/admin/logs/",
      { params }
    );

    return res.data.data;
  },

  getManagementLog: async (): Promise<ManagementLogResponse> => {
    if (USE_MOCK) {
      return { 
        total_errors: 111,
        percent_increase_errors: 10,
        today_errors: 15,
        percent_increase_today_errors: 5,
        avg_response_time: 250,
        percent_increase_avg_response_time: 15
      } as ManagementLogResponse;
    }

    const res = await api.get<ApiResponse<ManagementLogResponse>>(
      "/admin/logs/management"
    );

    return res.data.data;
  },
};
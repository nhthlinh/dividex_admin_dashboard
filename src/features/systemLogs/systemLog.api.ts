import { api } from "../../config/api.config";
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
    const res = await api.get<ApiResponse<SystemLogListResponse>>(
      "/admin/logs/",
      { params }
    );

    return res.data.data;
  },

  getManagementLog: async (): Promise<ManagementLogResponse> => {
    const res = await api.get<ApiResponse<ManagementLogResponse>>(
      "/admin/logs/management"
    );

    return res.data.data;
  },
};
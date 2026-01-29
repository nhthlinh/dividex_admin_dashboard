import { api } from "../../config/api.config";
import type { ApiResponse } from "../../config/api.types";
import type { GroupListResponse, GroupStatistics } from "./group.types";

export const GroupAPI = {
  getGroupStatistics: async (): Promise<GroupStatistics> => {
    const res = await api.get<ApiResponse<GroupStatistics>>(
      "/admin/group"
    );

    return res.data.data;
  },

  getGroups: async (params?: {
    search?: string;
    page?: number;
    page_size?: number;
  }): Promise<GroupListResponse> => {
    const res = await api.get<ApiResponse<GroupListResponse>>(
      "/admin/groups",
      {
        params: {
          search: params?.search ?? null,
          page: params?.page ?? 1,
          page_size: params?.page_size ?? 10,
        },
      }
    );

    return res.data.data;
  },

  deactivateGroup: async (groupUid: string): Promise<void> => {
    await api.patch(`/admin/group/${groupUid}`);
  },

  activateGroup: async (groupUid: string): Promise<void> => {
    await api.patch(`/admin/group/active/${groupUid}`);
  }
};

import { api } from "../../config/api.config";
import type { ApiResponse } from "../../config/api.types";
import type { GetGroupMembersParams, GroupActivityListResponse, GroupListResponse, GroupMembersResponse, GroupStatistics } from "./group.types";

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
  },

  getGroupMembers: async (
    group_uid: string,
    params?: GetGroupMembersParams
  ): Promise<GroupMembersResponse> => {
    const res = await api.get<ApiResponse<GroupMembersResponse>>(
      `/groups/${group_uid}/members`,
      { params }
    );

    return res.data.data;
  },

  getGroupActivity: async (
    group_uid: string,
    page: number = 1,
    page_size: number = 2
  ): Promise<GroupActivityListResponse> => {
    const res = await api.get<ApiResponse<GroupActivityListResponse>>(
      `/admin/group/${group_uid}/activity`,
      {
        params: { page, page_size },
      }
    );

    return res.data.data;
  },
};
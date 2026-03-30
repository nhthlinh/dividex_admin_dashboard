import { api } from "../../config/api.config";
import { mockApi, USE_MOCK } from "../../services/mockApi";
import type { ApiResponse } from "../../config/api.types";
import type { GetGroupMembersParams, GroupActivityListResponse, GroupListResponse, GroupMembersResponse, GroupStatistics } from "./group.types";

export const GroupAPI = {
  getGroupStatistics: async (): Promise<GroupStatistics> => {
    if (USE_MOCK) {
      return { 
        total_groups: 15,
        total_members: 200,
        active_groups: 12,
        percent_increase_groups: 10,
        percent_increase_members: 5,
        percent_increase_active_groups: 15
       } as GroupStatistics;
    }

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
    if (USE_MOCK) {
      return mockApi.listGroups(params);
    }

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
    if (USE_MOCK) {
      await mockApi.updateGroup(groupUid, { status: 'INACTIVE' });
      return;
    }

    await api.patch(`/admin/group/${groupUid}`);
  },

  activateGroup: async (groupUid: string): Promise<void> => {
    if (USE_MOCK) {
      await mockApi.updateGroup(groupUid, { status: 'ACTIVE' });
      return;
    }

    await api.patch(`/admin/group/active/${groupUid}`);
  },

  getGroupMembers: async (
    group_uid: string,
    params?: GetGroupMembersParams
  ): Promise<GroupMembersResponse> => {
    if (USE_MOCK) {
      return mockApi.listGroupMembers(group_uid, params);
    }

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
    if (USE_MOCK) {
      return { content: [], current_page: page, page_size, total_rows: 0, total_pages: 0 } as GroupActivityListResponse;
    }

    const res = await api.get<ApiResponse<GroupActivityListResponse>>(
      `/admin/group/${group_uid}/activity`,
      {
        params: { page, page_size },
      }
    );

    return res.data.data;
  },
};
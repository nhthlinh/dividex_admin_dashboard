import { api } from "../../config/api.config";
import { mockApi, USE_MOCK } from "../../services/mockApi";
import type { ApiResponse } from "../../config/api.types";
import type {
  MessageGroupListResponse,
  MessageManagement,
  MessagesInGroupResponse,
} from "./messages.types";

export const MessageAPI = {
  getMessageGroups: async (params?: {
    page?: number;
    page_size?: number;
  }): Promise<MessageGroupListResponse> => {
    if (USE_MOCK) {
      const groups = await mockApi.getMessageGroups();
      return {
        content: groups,
        current_page: params?.page ?? 1,
        page_size: params?.page_size ?? 10,
        total_rows: groups.length,
        total_pages: 1,
      } as MessageGroupListResponse;
    }

    const res = await api.get<ApiResponse<MessageGroupListResponse>>(
      "/admin/messages/group",
      {
        params: {
          page: params?.page ?? 1,
          page_size: params?.page_size ?? 10,
        },
      }
    );

    return res.data.data;
  },

  getMessageManagement: async (): Promise<MessageManagement> => {
    if (USE_MOCK) {
      return { 
        total_messages: 100,
        active_groups: 12,
        message_today: 20,
        attachments: 30,
        percent_increase_messages: 0,
        percent_increase_active_groups: 0,
        percent_increase_message_today: 0,
        percent_increase_attachments: 0,
      } as MessageManagement;
    }

    const res = await api.get<ApiResponse<MessageManagement>>(
      "/admin/message-management"
    );

    return res.data.data;
  },

  getMessagesInGroup: async (
    groupUid: string,
    params?: {
      search?: string | null;
      page?: number;
      page_size?: number;
    }
  ): Promise<MessagesInGroupResponse> => {
    if (USE_MOCK) {
      return mockApi.listMessages(groupUid, params);
    }

    const res = await api.get<ApiResponse<MessagesInGroupResponse>>(
      `/admin/message/group/${groupUid}`,
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
};


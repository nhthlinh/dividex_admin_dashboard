import { api } from "../../config/api.config";
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

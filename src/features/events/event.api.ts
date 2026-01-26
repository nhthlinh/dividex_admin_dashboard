import { api } from "../../config/api.config";
import type { ApiResponse } from "../../config/api.types";
import type { EventListResponse, EventMemberListResponse, EventStatistics } from "./event.types";

export const EventAPI = {
  getEventStatistics: async (): Promise<EventStatistics> => {
    const res = await api.get<ApiResponse<EventStatistics>>(
      "/admin/events-management"
    );
    return res.data.data;
  },

  getEvents: async (params?: {
    search?: string;
    type?: "all" | "active" | "finished";
    page?: number;
    page_size?: number;
  }): Promise<EventListResponse> => {
    const res = await api.get<ApiResponse<EventListResponse>>(
      "/admin/events",
      {
        params: {
          search: params?.search ?? null,
          type: params?.type ?? null,
          page: params?.page ?? 1,
          page_size: params?.page_size ?? 10,
        },
      }
    );

    return res.data.data;
  },

  getEventMembers: async (params?: {
    search?: string;
    page?: number;
    page_size?: number;
  }): Promise<EventMemberListResponse> => {
    const res = await api.get<ApiResponse<EventMemberListResponse>>(
      "/admin/event-members",
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

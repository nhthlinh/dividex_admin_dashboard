import { api } from "../../config/api.config";
import { mockApi, USE_MOCK } from "../../services/mockApi";
import type { ApiResponse } from "../../config/api.types";
import type { EventListResponse, EventMemberListResponse, EventStatistics, ExpenseSimpleListResponse } from "./event.types";

export const EventAPI = {
  getEventStatistics: async (): Promise<EventStatistics> => {
    if (USE_MOCK) {
      return {
        total_events: 12,
        total_members: 150,
        active_events: 8,
        total_finished_events: 4,
        percent_increase_events: 10,
        percent_increase_members: 5,
        percent_increase_active_events: 15,
        percent_increase_finished_events: -5
      } as EventStatistics;
    }

    const res = await api.get<ApiResponse<EventStatistics>>(
      "/admin/event-management"
    );
    return res.data.data;
  },

  getEvents: async (params?: {
    search?: string;
    type?: "all" | "active" | "finished";
    page?: number;
    page_size?: number;
  }): Promise<EventListResponse> => {
    if (USE_MOCK) {
      return mockApi.listEvents(params);
    }

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
    event_uid: string;
    search?: string;
    page?: number;
    page_size?: number;
  }): Promise<EventMemberListResponse> => {
    if (USE_MOCK) {
      return mockApi.listEventMembers(params?.event_uid || "", {
        search: params?.search,
        page: params?.page,
        page_size: params?.page_size,
      });
    }

    const res = await api.get<ApiResponse<EventMemberListResponse>>(
      `/admin/event/${params?.event_uid}/event-members`,
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

  getEventsInGroup: async (params?: {
    group_uid: string;
    search?: string;
    page?: number;
    page_size?: number;
    type?: "all" | "active" | "finished";
  }): Promise<EventListResponse> => {
    if (USE_MOCK) {
      return mockApi.listEvents({
        search: params?.search,
        page: params?.page,
        page_size: params?.page_size,
      });
    }

    const res = await api.get<ApiResponse<EventListResponse>>(
      "/admin/events",
      {
        params: {
          search: params?.search ?? null,
          type: params?.type ?? null,
          page: params?.page ?? 1,
          page_size: params?.page_size ?? 10,
          group_uid: params?.group_uid ?? null,
        },
      }
    );

    return res.data.data;
  },

  deactivateEvent: async (eventUid: string): Promise<void> => {
    if (USE_MOCK) {
      await mockApi.updateEvent(eventUid, { status: 'INACTIVE' });
      return;
    }

    await api.patch(`/admin/event/${eventUid}`);
  },

  activateEvent: async (eventUid: string): Promise<void> => {
    if (USE_MOCK) {
      await mockApi.updateEvent(eventUid, { status: 'ACTIVE' });
      return;
    }

    await api.patch(`/admin/event/active/${eventUid}`);
  },

  getExpensesInEvent: async (eventUid: string): Promise<ExpenseSimpleListResponse> => {
    if (USE_MOCK) {
      return mockApi.listEventExpenses(eventUid);
    }

    const res = await api.get(`/admin/expense/${eventUid}`);
    return res.data.data;
  }
};


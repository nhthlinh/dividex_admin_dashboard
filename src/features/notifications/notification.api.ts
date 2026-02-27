import { api } from "../../config/api.config";
import type { ApiResponse } from "../../config/api.types";
import type { CreateNotificationPayload, NotificationItem, NotificationListParams, NotificationListResponse, NotificationStats } from "./notification.types";

export const NotificationAPI = {
  // Thống kê notification
  getNotificationStats: async (): Promise<NotificationStats> => {
    const res = await api.get<ApiResponse<NotificationStats>>(
      "/admin/notifications-management"
    );
    return res.data.data;
  },

  // Danh sách notification
  listNotifications: async (
    params: NotificationListParams = {}
  ): Promise<NotificationListResponse> => {
    const res = await api.get<ApiResponse<NotificationListResponse>>(
      "/admin/notifications",
      {
        params: {
          search: params.search,
          type: params.type,
          page: params.page ?? 1,
          page_size: params.page_size ?? 10,
        },
      }
    );
    return res.data.data;
  },

  // Tạo notification
  createNotification: async (
    payload: CreateNotificationPayload
  ): Promise<NotificationItem> => {
    const res = await api.post<ApiResponse<NotificationItem>>(
      "/admin/notifications",
      payload
    );
    return res.data.data;
  },

  // Xoá notification
  deleteNotification: async (
    notification_uid: string
  ): Promise<boolean> => {
    const res = await api.delete<ApiResponse<boolean>>(
      `/admin/notifications/${notification_uid}`
    );
    return res.data.data;
  },
};
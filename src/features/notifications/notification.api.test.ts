/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotificationAPI } from './notification.api';

// Mock axios
vi.mock('../../config/api.config', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
}));

// Mock the mockApi
vi.mock('../../services/mockApi', () => ({
  mockApi: {
    getNotificationStats: vi.fn(),
    listNotifications: vi.fn(),
    createNotification: vi.fn(),
    deleteNotification: vi.fn(),
  },
  USE_MOCK: false,
}));

import { api as apiClient } from '../../config/api.config';

const mockApiClient = apiClient as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  patch: ReturnType<typeof vi.fn>;
};

describe('NotificationAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getNotificationStats', () => {
    it('should call get endpoint for notification stats', async () => {
      const mockResponse = {
        total_notifications: 100,
        notifications_today: 25,
        sent_today: 10,
        failed_count: 2,
        percent_increase: 5.5,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await NotificationAPI.getNotificationStats();

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/notifications-management'
      );
      expect(result.total_notifications).toBe(100);
      expect(result.notifications_today).toBe(25);
    });

    it('should return correct notification stats values', async () => {
      const mockResponse = {
        total_notifications: 500,
        notifications_today: 75,
        percent_increase_notifications_today: 45,
        failed_count: 5,
        percent_increase_total_notifications: 12.3,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await NotificationAPI.getNotificationStats();

      expect(result.notifications_today).toBe(75);
      expect(result.percent_increase_notifications_today).toBe(45);
      expect(result.percent_increase_total_notifications).toBe(12.3);
      expect(result.total_notifications).toBe(500);
    });

    it('should handle API errors for stats', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Service unavailable'));

      await expect(NotificationAPI.getNotificationStats()).rejects.toThrow(
        'Service unavailable'
      );
    });
  });

  describe('listNotifications', () => {
    it('should call get endpoint with default pagination', async () => {
      const mockResponse = {
        content: [],
        current_page: 1,
        page_size: 10,
        total_rows: 0,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await NotificationAPI.listNotifications();

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/notifications',
        {
          params: {
            search: undefined,
            type: undefined,
            page: 1,
            page_size: 10,
          },
        }
      );
    });

    it('should handle search parameters', async () => {
      const mockResponse = {
        content: [],
        current_page: 1,
        page_size: 10,
        total_rows: 1,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await NotificationAPI.listNotifications({ search: 'payment' });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/notifications',
        expect.objectContaining({
          params: expect.objectContaining({
            search: 'payment',
          }),
        })
      );
    });

    it('should handle type filter', async () => {
      mockApiClient.get.mockResolvedValue({
        data: {
          data: {
            content: [],
            current_page: 1,
            page_size: 10,
            total_rows: 0,
            total_pages: 1,
          },
        },
      });

      await NotificationAPI.listNotifications({ type: 'System' });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/notifications',
        expect.objectContaining({
          params: expect.objectContaining({
            type: 'System',
          }),
        })
      );
    });

    it('should handle custom pagination', async () => {
      const mockResponse = {
        content: [],
        current_page: 2,
        page_size: 20,
        total_rows: 50,
        total_pages: 3,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await NotificationAPI.listNotifications({
        page: 2,
        page_size: 20,
      });

      expect(result.current_page).toBe(2);
      expect(result.page_size).toBe(20);
      expect(result.total_pages).toBe(3);
    });

    it('should return notifications list', async () => {
      const mockResponse = {
        content: [
          {
            uid: 'notif-1',
            title: 'New booking',
            message: 'You have a new booking',
            type: 'booking',
          },
          {
            uid: 'notif-2',
            title: 'Payment received',
            message: 'Payment of $100 received',
            type: 'payment',
          },
        ],
        current_page: 1,
        page_size: 10,
        total_rows: 2,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await NotificationAPI.listNotifications();

      expect(result.content).toHaveLength(2);
      expect(result.content[0].type).toBe('booking');
      expect(result.content[1].type).toBe('payment');
    });

    it('should handle empty notifications list', async () => {
      const mockResponse = {
        content: [],
        current_page: 1,
        page_size: 10,
        total_rows: 0,
        total_pages: 0,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await NotificationAPI.listNotifications();

      expect(result.content).toEqual([]);
      expect(result.total_rows).toBe(0);
    });

    it('should handle combined search and type filter', async () => {
      mockApiClient.get.mockResolvedValue({
        data: {
          data: {
            content: [],
            current_page: 1,
            page_size: 10,
            total_rows: 0,
            total_pages: 1,
          },
        },
      });

      await NotificationAPI.listNotifications({
        search: 'error',
        type: 'Warning',
        page: 1,
        page_size: 15,
      });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/notifications',
        {
          params: {
            search: 'error',
            type: 'Warning',
            page: 1,
            page_size: 15,
          },
        }
      );
    });

    it('should handle API error for list', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Network error'));

      await expect(NotificationAPI.listNotifications()).rejects.toThrow(
        'Network error'
      );
    });
  });

  describe('createNotification', () => {
    it('should call post endpoint with notification payload', async () => {
      const payload = {
        title: 'Welcome',
        content: 'Welcome to our platform',
        type: 'System' as "System" | "Warning" | "Announcement" | "Reminder",
        to_user_uids: [],
        is_broadcast: false,
      };

      mockApiClient.post.mockResolvedValue({
        data: {
          data: {
            uid: 'notif-123',
            ...payload,
          },
        },
      });

      const result = await NotificationAPI.createNotification(payload);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/admin/notifications',
        payload
      );
      expect(result.uid).toBe('notif-123');
      expect(result.content).toBe('Welcome to our platform');
    });

    it('should return created notification', async () => {
      const payload = {
        title: 'New Event',
        content: 'Event scheduled',
        type: 'System' as "System" | "Warning" | "Announcement" | "Reminder",
        to_user_uids: [],
        is_broadcast: false,
      };

      mockApiClient.post.mockResolvedValue({
        data: {
          data: {
            uid: 'notif-456',
            ...payload,
            created_at: '2024-01-01T00:00:00Z',
          },
        },
      });

      const result = await NotificationAPI.createNotification(payload);

      expect(result.content).toBe('Event scheduled');
      expect(result.type).toBe('System');
    });

    it('should handle different notification types', async () => {
      const types = ['System', 'Warning', 'Announcement', 'Reminder'];

      for (const type of types) {
        mockApiClient.post.mockResolvedValue({
          data: {
            data: {
              uid: `notif-${type}`,
              title: `Notification ${type}`,
              content: `This is a ${type} notification`,
              type: type as "System" | "Warning" | "Announcement" | "Reminder",
            },
          },
        });

        const result = await NotificationAPI.createNotification({
          content: `This is a ${type} notification`,
          type: type as "System" | "Warning" | "Announcement" | "Reminder",
          to_user_uids: [],
          is_broadcast: false,
        });

        expect(result.type).toBe(type);
      }
    });

    it('should handle create error', async () => {
      mockApiClient.post.mockRejectedValue(
        new Error('Failed to create notification')
      );

      await expect(
        NotificationAPI.createNotification({
          content: 'Test',
          type: 'System' as "System" | "Warning" | "Announcement" | "Reminder",
          to_user_uids: [],
          is_broadcast: false,
        })
      ).rejects.toThrow('Failed to create notification');
    });

    it('should handle validation error', async () => {
      const error = new Error('Invalid payload');
      (error as any).response = { status: 400 };
      mockApiClient.post.mockRejectedValue(error);

      await expect(
        NotificationAPI.createNotification({
          content: '',
          type: 'System' as "System" | "Warning" | "Announcement" | "Reminder",
          to_user_uids: [],
          is_broadcast: false,
        })
      ).rejects.toThrow();
    });
  });

  describe('deleteNotification', () => {
    it('should call delete endpoint with notification uid', async () => {
      mockApiClient.delete.mockResolvedValue({ data: { data: true } });

      const result = await NotificationAPI.deleteNotification('notif-123');

      expect(mockApiClient.delete).toHaveBeenCalledWith(
        '/admin/notifications/notif-123'
      );
      expect(result).toBe(true);
    });

    it('should handle different notification uids', async () => {
      mockApiClient.delete.mockResolvedValue({ data: { data: true } });

      await NotificationAPI.deleteNotification('notif-456');

      expect(mockApiClient.delete).toHaveBeenCalledWith(
        '/admin/notifications/notif-456'
      );
    });

    it('should return boolean on success', async () => {
      mockApiClient.delete.mockResolvedValue({ data: { data: true } });

      const result = await NotificationAPI.deleteNotification('notif-789');

      expect(typeof result).toBe('boolean');
      expect(result).toBe(true);
    });

    it('should handle delete error', async () => {
      mockApiClient.delete.mockRejectedValue(
        new Error('Notification not found')
      );

      await expect(
        NotificationAPI.deleteNotification('invalid-uid')
      ).rejects.toThrow('Notification not found');
    });

    it('should handle 404 not found', async () => {
      const error = new Error('Not found');
      (error as any).response = { status: 404 };
      mockApiClient.delete.mockRejectedValue(error);

      await expect(
        NotificationAPI.deleteNotification('nonexistent')
      ).rejects.toThrow();
    });

    it('should handle delete permission error', async () => {
      const error = new Error('Forbidden');
      (error as any).response = { status: 403 };
      mockApiClient.delete.mockRejectedValue(error);

      await expect(
        NotificationAPI.deleteNotification('notif-restricted')
      ).rejects.toThrow();
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Network timeout'));

      await expect(NotificationAPI.listNotifications()).rejects.toThrow(
        'Network timeout'
      );
    });

    it('should handle 500 server error', async () => {
      const error = new Error('Internal server error');
      (error as any).response = { status: 500 };
      mockApiClient.get.mockRejectedValue(error);

      await expect(NotificationAPI.getNotificationStats()).rejects.toThrow();
    });

    it('should handle 401 unauthorized', async () => {
      const error = new Error('Unauthorized');
      (error as any).response = { status: 401 };
      mockApiClient.post.mockRejectedValue(error);

      await expect(
        NotificationAPI.createNotification({
          content: 'Test',
          type: 'System' as "System" | "Warning" | "Announcement" | "Reminder",
          to_user_uids: ['test'],
          is_broadcast: false,
        })
      ).rejects.toThrow();
    });
  });
});

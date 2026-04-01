/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MessageAPI } from './messages.api';

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
    getMessageGroups: vi.fn(),
    listMessages: vi.fn(),
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

describe('MessageAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMessageGroups', () => {
    it('should call get endpoint with default pagination', async () => {
      const mockResponse = {
        content: [],
        current_page: 1,
        page_size: 10,
        total_rows: 0,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await MessageAPI.getMessageGroups();

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/messages/group',
        {
          params: {
            page: 1,
            page_size: 10,
          },
        }
      );
    });

    it('should handle custom pagination parameters', async () => {
      const mockResponse = {
        content: [],
        current_page: 2,
        page_size: 20,
        total_rows: 50,
        total_pages: 3,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await MessageAPI.getMessageGroups({ page: 2, page_size: 20 });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/messages/group',
        {
          params: {
            page: 2,
            page_size: 20,
          },
        }
      );
      expect(result.current_page).toBe(2);
      expect(result.page_size).toBe(20);
    });

    it('should return message groups correctly', async () => {
      const mockResponse = {
        content: [
          { uid: '1', name: 'Group 1', member_count: 5 },
          { uid: '2', name: 'Group 2', member_count: 10 },
        ],
        current_page: 1,
        page_size: 10,
        total_rows: 2,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await MessageAPI.getMessageGroups();

      expect(result.content).toHaveLength(2);
      expect(result.total_rows).toBe(2);
    });

    it('should handle API errors', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Network error'));

      await expect(MessageAPI.getMessageGroups()).rejects.toThrow('Network error');
    });
  });

  describe('getMessageManagement', () => {
    it('should call get endpoint for message management stats', async () => {
      const mockResponse = {
        total_messages: 100,
        active_groups: 12,
        message_today: 20,
        attachments: 30,
        percent_increase_messages: 5,
        percent_increase_active_groups: 2,
        percent_increase_message_today: 10,
        percent_increase_attachments: 8,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await MessageAPI.getMessageManagement();

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/message-management'
      );
      expect(result.total_messages).toBe(100);
      expect(result.active_groups).toBe(12);
    });

    it('should return correct message stats', async () => {
      const mockResponse = {
        total_messages: 500,
        active_groups: 25,
        message_today: 50,
        attachments: 75,
        percent_increase_messages: 15.5,
        percent_increase_active_groups: 8.3,
        percent_increase_message_today: 25.0,
        percent_increase_attachments: 12.5,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await MessageAPI.getMessageManagement();

      expect(result.percent_increase_messages).toBe(15.5);
      expect(result.message_today).toBe(50);
    });

    it('should handle API errors for message management', async () => {
      mockApiClient.get.mockRejectedValue(new Error('API Error'));

      await expect(MessageAPI.getMessageManagement()).rejects.toThrow('API Error');
    });
  });

  describe('getMessagesInGroup', () => {
    it('should call get endpoint with group uid', async () => {
      const mockResponse = {
        content: [],
        current_page: 1,
        page_size: 10,
        total_rows: 0,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await MessageAPI.getMessagesInGroup('group-123');

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/message/group/group-123',
        {
          params: {
            search: null,
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
        total_rows: 0,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await MessageAPI.getMessagesInGroup('group-123', { search: 'hello' });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/message/group/group-123',
        expect.objectContaining({
          params: expect.objectContaining({
            search: 'hello',
          }),
        })
      );
    });

    it('should handle pagination for messages in group', async () => {
      const mockResponse = {
        content: [],
        current_page: 3,
        page_size: 25,
        total_rows: 100,
        total_pages: 4,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await MessageAPI.getMessagesInGroup('group-123', {
        page: 3,
        page_size: 25,
      });

      expect(result.current_page).toBe(3);
      expect(result.page_size).toBe(25);
      expect(result.total_pages).toBe(4);
    });

    it('should return messages in group', async () => {
      const mockResponse = {
        content: [
          { uid: 'm1', message: 'Hello', timestamp: '2024-01-01' },
          { uid: 'm2', message: 'Hi there', timestamp: '2024-01-02' },
        ],
        current_page: 1,
        page_size: 10,
        total_rows: 2,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await MessageAPI.getMessagesInGroup('group-123');

      expect(result.content).toHaveLength(2);
      expect(result.total_rows).toBe(2);
    });

    it('should handle empty message list', async () => {
      const mockResponse = {
        content: [],
        current_page: 1,
        page_size: 10,
        total_rows: 0,
        total_pages: 0,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await MessageAPI.getMessagesInGroup('group-123');

      expect(result.content).toEqual([]);
      expect(result.total_rows).toBe(0);
    });

    it('should handle errors when fetching messages', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Group not found'));

      await expect(
        MessageAPI.getMessagesInGroup('invalid-group')
      ).rejects.toThrow('Group not found');
    });

    it('should handle different group uids', async () => {
      mockApiClient.get.mockResolvedValue({
        data: { data: { content: [], current_page: 1, page_size: 10, total_rows: 0, total_pages: 1 } },
      });

      await MessageAPI.getMessagesInGroup('group-456');

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/message/group/group-456',
        expect.any(Object)
      );
    });
  });

  describe('error handling', () => {
    it('should handle 404 errors', async () => {
      const error = new Error('Not found');
      (error as any).response = { status: 404 };
      mockApiClient.get.mockRejectedValue(error);

      await expect(MessageAPI.getMessageGroups()).rejects.toThrow();
    });

    it('should handle 500 server errors', async () => {
      const error = new Error('Internal server error');
      (error as any).response = { status: 500 };
      mockApiClient.get.mockRejectedValue(error);

      await expect(MessageAPI.getMessageManagement()).rejects.toThrow();
    });

    it('should handle network timeout', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Timeout'));

      await expect(
        MessageAPI.getMessagesInGroup('group-123')
      ).rejects.toThrow('Timeout');
    });
  });
});

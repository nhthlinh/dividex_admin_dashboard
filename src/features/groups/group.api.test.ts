/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GroupAPI } from './group.api';

// Mock axios
vi.mock('../../config/api.config', () => ({
  api: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

// Mock the mockApi
vi.mock('../../services/mockApi', () => ({
  mockApi: {
    listGroups: vi.fn(),
    updateGroup: vi.fn(),
    listGroupMembers: vi.fn(),
  },
  USE_MOCK: false,
}));

import { api as apiClient } from '../../config/api.config';

const mockApiClient = apiClient as unknown as {
  get: ReturnType<typeof vi.fn>;
  patch: ReturnType<typeof vi.fn>;
};

describe('GroupAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getGroupStatistics', () => {
    it('should call get endpoint for group statistics', async () => {
      const mockResponse = {
        total_groups: 15,
        total_members: 200,
        active_groups: 12,
        percent_increase_groups: 10,
        percent_increase_members: 5,
        percent_increase_active_groups: 15,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await GroupAPI.getGroupStatistics();

      expect(mockApiClient.get).toHaveBeenCalledWith('/admin/group');
      expect(result.total_groups).toBe(15);
    });

    it('should return statistics with all fields', async () => {
      const mockResponse = {
        total_groups: 20,
        total_members: 300,
        active_groups: 18,
        percent_increase_groups: 15,
        percent_increase_members: 10,
        percent_increase_active_groups: 20,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await GroupAPI.getGroupStatistics();

      expect(result.total_groups).toBe(20);
      expect(result.total_members).toBe(300);
      expect(result.active_groups).toBe(18);
    });

    it('should handle negative percent changes', async () => {
      const mockResponse = {
        total_groups: 10,
        total_members: 150,
        active_groups: 8,
        percent_increase_groups: -5,
        percent_increase_members: -2,
        percent_increase_active_groups: -10,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await GroupAPI.getGroupStatistics();

      expect(result.percent_increase_groups).toBe(-5);
    });
  });

  describe('getGroups', () => {
    it('should call get endpoint with default parameters', async () => {
      const mockResponse = {
        content: [],
        total_rows: 0,
        current_page: 1,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await GroupAPI.getGroups();

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/groups',
        {
          params: {
            search: null,
            page: 1,
            page_size: 10,
          },
        }
      );
    });

    it('should handle search parameter', async () => {
      const mockResponse = { content: [], total_rows: 0, current_page: 1, total_pages: 1 };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await GroupAPI.getGroups({ search: 'family' });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/groups',
        expect.objectContaining({
          params: expect.objectContaining({
            search: 'family',
          }),
        })
      );
    });

    it('should handle pagination parameters', async () => {
      const mockResponse = { content: [], total_rows: 0, current_page: 2, total_pages: 2 };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await GroupAPI.getGroups({ page: 2, page_size: 20 });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/groups',
        expect.objectContaining({
          params: expect.objectContaining({
            page: 2,
            page_size: 20,
          }),
        })
      );
    });

    it('should return groups list', async () => {
      const mockResponse = {
        content: [
          { gid: '1', group_name: 'Friends' },
          { gid: '2', group_name: 'Family' },
        ],
        total_rows: 2,
        current_page: 1,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await GroupAPI.getGroups();

      expect(result.content).toHaveLength(2);
    });
  });

  describe('deactivateGroup', () => {
    it('should call patch endpoint to deactivate group', async () => {
      mockApiClient.patch.mockResolvedValue({ data: {} });

      await GroupAPI.deactivateGroup('group-123');

      expect(mockApiClient.patch).toHaveBeenCalledWith('/admin/group/group-123');
    });

    it('should handle different group uids', async () => {
      mockApiClient.patch.mockResolvedValue({ data: {} });

      await GroupAPI.deactivateGroup('another-group');

      expect(mockApiClient.patch).toHaveBeenCalledWith('/admin/group/another-group');
    });

    it('should return void on success', async () => {
      mockApiClient.patch.mockResolvedValue({ data: {} });

      const result = await GroupAPI.deactivateGroup('group-123');

      expect(result).toBeUndefined();
    });

    it('should throw error on deactivation failure', async () => {
      mockApiClient.patch.mockRejectedValue(new Error('Deactivation failed'));

      await expect(GroupAPI.deactivateGroup('group-123')).rejects.toThrow('Deactivation failed');
    });
  });

  describe('activateGroup', () => {
    it('should call patch endpoint to activate group', async () => {
      mockApiClient.patch.mockResolvedValue({ data: {} });

      await GroupAPI.activateGroup('group-123');

      expect(mockApiClient.patch).toHaveBeenCalledWith('/admin/group/active/group-123');
    });

    it('should handle different group uids', async () => {
      mockApiClient.patch.mockResolvedValue({ data: {} });

      await GroupAPI.activateGroup('new-group');

      expect(mockApiClient.patch).toHaveBeenCalledWith('/admin/group/active/new-group');
    });

    it('should return void on success', async () => {
      mockApiClient.patch.mockResolvedValue({ data: {} });

      const result = await GroupAPI.activateGroup('group-123');

      expect(result).toBeUndefined();
    });

    it('should throw error on activation failure', async () => {
      mockApiClient.patch.mockRejectedValue(new Error('Activation failed'));

      await expect(GroupAPI.activateGroup('group-123')).rejects.toThrow('Activation failed');
    });
  });

  describe('getGroupMembers', () => {
    it('should call get endpoint with group uid', async () => {
      const mockResponse = {
        content: [],
        total_rows: 0,
        current_page: 1,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await GroupAPI.getGroupMembers('group-123');

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/groups/group-123/members',
        { params: undefined }
      );
    });

    it('should handle pagination parameters', async () => {
      const mockResponse = { content: [], total_rows: 0, current_page: 1, total_pages: 1 };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await GroupAPI.getGroupMembers('group-123', { page: 2, page_size: 15 });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/groups/group-123/members',
        expect.objectContaining({
          params: expect.objectContaining({
            page: 2,
            page_size: 15,
          }),
        })
      );
    });

    it('should return group members', async () => {
      const mockResponse = {
        content: [
          { uid: '1', full_name: 'User 1', status: 'active' },
          { uid: '2', full_name: 'User 2', status: 'active' },
        ],
        total_rows: 2,
        current_page: 1,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await GroupAPI.getGroupMembers('group-123');

      expect(result.content).toHaveLength(2);
    });

    it('should throw error if group not found', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Group not found'));

      await expect(GroupAPI.getGroupMembers('nonexistent')).rejects.toThrow('Group not found');
    });
  });

  describe('getGroupActivity', () => {
    it('should call get endpoint with default parameters', async () => {
      const mockResponse = {
        content: [],
        total_rows: 0,
        current_page: 1,
        page_size: 2,
        total_pages: 0,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await GroupAPI.getGroupActivity('group-123');

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/group/group-123/activity',
        {
          params: { page: 1, page_size: 2 },
        }
      );
    });

    it('should handle custom page and page_size', async () => {
      const mockResponse = {
        content: [],
        total_rows: 0,
        current_page: 2,
        page_size: 5,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await GroupAPI.getGroupActivity('group-123', 2, 5);

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/group/group-123/activity',
        {
          params: { page: 2, page_size: 5 },
        }
      );
    });

    it('should return activity list', async () => {
      const mockResponse = {
        content: [
          { id: '1', action: 'User added', created_at: '2024-01-01' },
          { id: '2', action: 'Expense added', created_at: '2024-01-02' },
        ],
        total_rows: 2,
        current_page: 1,
        page_size: 2,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await GroupAPI.getGroupActivity('group-123');

      expect(result.content).toHaveLength(2);
    });

    it('should throw error if group not found', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Group not found'));

      await expect(GroupAPI.getGroupActivity('nonexistent')).rejects.toThrow('Group not found');
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Network error'));

      await expect(GroupAPI.getGroups()).rejects.toThrow('Network error');
    });

    it('should handle API 500 errors', async () => {
      const error = new Error('Server error');
      (error as any).response = { status: 500 };
      mockApiClient.get.mockRejectedValue(error);

      await expect(GroupAPI.getGroups()).rejects.toThrow('Server error');
    });

    it('should handle 401 unauthorized', async () => {
      const error = new Error('Unauthorized');
      (error as any).response = { status: 401 };
      mockApiClient.patch.mockRejectedValue(error);

      await expect(GroupAPI.deactivateGroup('group-123')).rejects.toThrow('Unauthorized');
    });

    it('should handle 404 not found', async () => {
      const error = new Error('Not found');
      (error as any).response = { status: 404 };
      mockApiClient.get.mockRejectedValue(error);

      await expect(GroupAPI.getGroupMembers('nonexistent')).rejects.toThrow('Not found');
    });
  });
});

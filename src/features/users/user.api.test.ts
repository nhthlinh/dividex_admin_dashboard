/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserAPI } from './user.api';

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
    listUsers: vi.fn(),
    searchUsers: vi.fn(),
    getUserDetail: vi.fn(),
    activateUser: vi.fn(),
    deActivateUser: vi.fn(),
    listUserGroups: vi.fn(),
    listUserExpenses: vi.fn(),
    getUserLoginHistory: vi.fn(),
  },
  USE_MOCK: false,
}));

import { api as apiClient } from '../../config/api.config';

const mockApiClient = apiClient as unknown as {
  get: ReturnType<typeof vi.fn>;
  patch: ReturnType<typeof vi.fn>;
};

describe('UserAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listUsers', () => {
    it('should call get endpoint with correct URL', async () => {
      const mockResponse = {
        content: [],
        total_rows: 0,
        current_page: 1,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await UserAPI.listUsers({});

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/users',
        {
          params: {
            search: undefined,
            order_by: 'full_name',
            sort_type: 'desc',
            page: 1,
            page_size: 10,
          },
        }
      );
    });

    it('should handle pagination parameters', async () => {
      const mockResponse = {
        content: [{ uid: '1', full_name: 'User 1' }],
        total_rows: 20,
        current_page: 2,
        total_pages: 2,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await UserAPI.listUsers({ page: 2, page_size: 10 });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/users',
        expect.objectContaining({
          params: expect.objectContaining({
            page: 2,
            page_size: 10,
          }),
        })
      );
      expect(result.current_page).toBe(2);
    });

    it('should handle search parameters', async () => {
      const mockResponse = {
        content: [{ uid: '1', full_name: 'John' }],
        total_rows: 1,
        current_page: 1,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await UserAPI.listUsers({ search: 'john' });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/users',
        expect.objectContaining({
          params: expect.objectContaining({
            search: 'john',
          }),
        })
      );
    });

    it('should handle order_by parameter', async () => {
      const mockResponse = { content: [], total_rows: 0, current_page: 1, total_pages: 1 };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await UserAPI.listUsers({ order_by: 'updated_at' });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/users',
        expect.objectContaining({
          params: expect.objectContaining({
            order_by: 'updated_at',
          }),
        })
      );
    });

    it('should handle sort_type parameter', async () => {
      const mockResponse = { content: [], total_rows: 0, current_page: 1, total_pages: 1 };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await UserAPI.listUsers({ sort_type: 'asc' });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/users',
        expect.objectContaining({
          params: expect.objectContaining({
            sort_type: 'asc',
          }),
        })
      );
    });

    it('should return list users response', async () => {
      const mockResponse = {
        content: [
          { uid: '1', full_name: 'User 1', email: 'user1@example.com' },
          { uid: '2', full_name: 'User 2', email: 'user2@example.com' },
        ],
        total_rows: 2,
        current_page: 1,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await UserAPI.listUsers({});

      expect(result.content).toHaveLength(2);
      expect(result.total_rows).toBe(2);
    });
  });

  describe('searchUsers', () => {
    it('should call get endpoint with search params', async () => {
      const mockResponse = {
        content: [],
        total_rows: 0,
        current_page: 1,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await UserAPI.searchUsers({ search: 'test' });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/users',
        {
          params: {
            search: 'test',
            page: 1,
            page_size: 10,
          },
        }
      );
    });

    it('should handle custom page and page_size', async () => {
      const mockResponse = { content: [], total_rows: 0, current_page: 3, total_pages: 3 };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await UserAPI.searchUsers({ search: 'test', page: 3, page_size: 20 });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/users',
        expect.objectContaining({
          params: expect.objectContaining({
            page: 3,
            page_size: 20,
          }),
        })
      );
    });

    it('should return search results', async () => {
      const mockResponse = {
        content: [{ uid: '1', full_name: 'Test User' }],
        total_rows: 1,
        current_page: 1,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await UserAPI.searchUsers({ search: 'test' });

      expect(result.content).toHaveLength(1);
    });
  });

  describe('getUserDetail', () => {
    it('should call get endpoint with user uid', async () => {
      const mockResponse = {
        uid: '123',
        email: 'user@example.com',
        full_name: 'Test User',
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await UserAPI.getUserDetail('123');

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/users/123'
      );
    });

    it('should return user detail', async () => {
      const mockResponse = {
        uid: '456',
        email: 'user2@example.com',
        full_name: 'Another User',
        status: 'active',
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await UserAPI.getUserDetail('456');

      expect(result.uid).toBe('456');
      expect(result.email).toBe('user2@example.com');
      expect(result.full_name).toBe('Another User');
    });

    it('should handle different user uids', async () => {
      const mockResponse = { uid: 'abc-123', email: 'test@example.com' };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await UserAPI.getUserDetail('abc-123');

      expect(mockApiClient.get).toHaveBeenCalledWith('/admin/users/abc-123');
    });

    it('should throw error on user not found', async () => {
      mockApiClient.get.mockRejectedValue(new Error('User not found'));

      await expect(UserAPI.getUserDetail('nonexistent')).rejects.toThrow('User not found');
    });
  });

  describe('activateUser', () => {
    it('should call patch endpoint to activate user', async () => {
      mockApiClient.patch.mockResolvedValue({ data: { data: true } });

      await UserAPI.activateUser('123');

      expect(mockApiClient.patch).toHaveBeenCalledWith(
        '/admin/users/123/activate'
      );
    });

    it('should return activation result', async () => {
      mockApiClient.patch.mockResolvedValue({ data: { data: true } });

      const result = await UserAPI.activateUser('123');

      expect(result).toBe(true);
    });

    it('should handle different user uids', async () => {
      mockApiClient.patch.mockResolvedValue({ data: { data: true } });

      await UserAPI.activateUser('user-456');

      expect(mockApiClient.patch).toHaveBeenCalledWith('/admin/users/user-456/activate');
    });

    it('should throw error on activation failure', async () => {
      mockApiClient.patch.mockRejectedValue(new Error('Activation failed'));

      await expect(UserAPI.activateUser('123')).rejects.toThrow('Activation failed');
    });
  });

  describe('deActivateUser', () => {
    it('should call patch endpoint to deactivate user', async () => {
      mockApiClient.patch.mockResolvedValue({ data: { data: true } });

      await UserAPI.deActivateUser('123');

      expect(mockApiClient.patch).toHaveBeenCalledWith(
        '/admin/123'
      );
    });

    it('should return deactivation result', async () => {
      mockApiClient.patch.mockResolvedValue({ data: { data: true } });

      const result = await UserAPI.deActivateUser('123');

      expect(result).toBe(true);
    });

    it('should throw error on deactivation failure', async () => {
      mockApiClient.patch.mockRejectedValue(new Error('Deactivation failed'));

      await expect(UserAPI.deActivateUser('123')).rejects.toThrow('Deactivation failed');
    });
  });

  describe('listUserGroups', () => {
    it('should call get endpoint with user uid', async () => {
      const mockResponse = {
        content: [],
        total_rows: 0,
        current_page: 1,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await UserAPI.listUserGroups('123');

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/users/123/groups',
        {
          params: {
            search: undefined,
            page: 1,
            page_size: 10,
          },
        }
      );
    });

    it('should handle pagination parameters', async () => {
      const mockResponse = {
        content: [{ gid: '1', group_name: 'Group 1' }],
        total_rows: 1,
        current_page: 1,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await UserAPI.listUserGroups('123', { page: 2, page_size: 20 });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/users/123/groups',
        expect.objectContaining({
          params: expect.objectContaining({
            page: 2,
            page_size: 20,
          }),
        })
      );
    });

    it('should handle search in groups', async () => {
      const mockResponse = { content: [], total_rows: 0, current_page: 1, total_pages: 1 };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await UserAPI.listUserGroups('123', { search: 'family' });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/users/123/groups',
        expect.objectContaining({
          params: expect.objectContaining({
            search: 'family',
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

      const result = await UserAPI.listUserGroups('123');

      expect(result.content).toHaveLength(2);
    });
  });

  describe('listUserExpenses', () => {
    it('should call get endpoint with user uid', async () => {
      const mockResponse = {
        content: [],
        total_rows: 0,
        current_page: 1,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await UserAPI.listUserExpenses('123');

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/users/123/expenses',
        {
          params: {
            search: undefined,
            page: 1,
            page_size: 10,
          },
        }
      );
    });

    it('should handle pagination', async () => {
      const mockResponse = { content: [], total_rows: 0, current_page: 2, total_pages: 2 };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await UserAPI.listUserExpenses('123', { page: 2, page_size: 15 });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/users/123/expenses',
        expect.objectContaining({
          params: expect.objectContaining({
            page: 2,
            page_size: 15,
          }),
        })
      );
    });

    it('should return expenses list', async () => {
      const mockResponse = {
        content: [
          { eid: '1', description: 'Lunch', amount: 15 },
          { eid: '2', description: 'Movie', amount: 12 },
        ],
        total_rows: 2,
        current_page: 1,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await UserAPI.listUserExpenses('123');

      expect(result.content).toHaveLength(2);
    });
  });

  describe('getUserLoginHistory', () => {
    it('should call get endpoint with user uid', async () => {
      const mockResponse = {
        content: [],
        total_rows: 0,
        current_page: 1,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await UserAPI.getUserLoginHistory('123');

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/users/123/login-history',
        {
          params: {
            page: 1,
            page_size: 10,
          },
        }
      );
    });

    it('should handle pagination', async () => {
      const mockResponse = { content: [], total_rows: 0, current_page: 1, total_pages: 1 };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await UserAPI.getUserLoginHistory('123', { page: 3, page_size: 20 });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/users/123/login-history',
        expect.objectContaining({
          params: expect.objectContaining({
            page: 3,
            page_size: 20,
          }),
        })
      );
    });

    it('should return login history', async () => {
      const mockResponse = {
        content: [
          { id: '1', ip_address: '192.168.1.1', login_time: '2024-01-01' },
          { id: '2', ip_address: '192.168.1.2', login_time: '2024-01-02' },
        ],
        total_rows: 2,
        current_page: 1,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await UserAPI.getUserLoginHistory('123');

      expect(result.content).toHaveLength(2);
    });

    it('should throw error on failed request', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Failed to fetch login history'));

      await expect(UserAPI.getUserLoginHistory('123')).rejects.toThrow('Failed to fetch login history');
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Network error'));

      await expect(UserAPI.listUsers({})).rejects.toThrow('Network error');
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error');
      (error as any).response = { status: 500 };
      mockApiClient.get.mockRejectedValue(error);

      await expect(UserAPI.listUsers({})).rejects.toThrow('API Error');
    });

    it('should handle 401 unauthorized', async () => {
      const error = new Error('Unauthorized');
      (error as any).response = { status: 401 };
      mockApiClient.get.mockRejectedValue(error);

      await expect(UserAPI.listUsers({})).rejects.toThrow('Unauthorized');
    });

    it('should handle 404 not found', async () => {
      const error = new Error('Not found');
      (error as any).response = { status: 404 };
      mockApiClient.get.mockRejectedValue(error);

      await expect(UserAPI.getUserDetail('nonexistent')).rejects.toThrow('Not found');
    });
  });
});

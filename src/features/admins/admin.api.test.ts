/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminAPI } from './admin.api';

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
    listAdmins: vi.fn(),
    createAdmin: vi.fn(),
    deleteAdmin: vi.fn(),
    deActivateAdmin: vi.fn(),
    activateAdmin: vi.fn(),
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

describe('AdminAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listAdmins', () => {
    it('should call get endpoint with correct URL', async () => {
      const mockResponse = {
        content: [],
        total_rows: 0,
        current_page: 1,
        total_pages: 1,
      };
      
      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await AdminAPI.listAdmins({});

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin',
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
        content: [],
        total_rows: 50,
        current_page: 2,
        total_pages: 5,
      };
      
      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await AdminAPI.listAdmins({ page: 2, page_size: 20 });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin',
        {
          params: {
            search: undefined,
            page: 2,
            page_size: 20,
          },
        }
      );
      expect(result.current_page).toBe(2);
    });

    it('should handle search parameters', async () => {
      const mockResponse = {
        content: [{ uid: '123', email: 'admin@example.com' }],
        total_rows: 1,
        current_page: 1,
        total_pages: 1,
      };
      
      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await AdminAPI.listAdmins({ search: 'admin' });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin',
        expect.objectContaining({
          params: expect.objectContaining({
            search: 'admin',
          }),
        })
      );
    });

    it('should return list response correctly', async () => {
      const mockResponse = {
        content: [
          {
            uid: '1',
            email: 'admin1@example.com',
            full_name: 'Admin One',
          },
          {
            uid: '2',
            email: 'admin2@example.com',
            full_name: 'Admin Two',
          },
        ],
        total_rows: 2,
        current_page: 1,
        total_pages: 1,
      };
      
      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await AdminAPI.listAdmins({});

      expect(result.content).toHaveLength(2);
      expect(result.total_rows).toBe(2);
    });
  });

  describe('createAdmin', () => {
    it('should call post endpoint with email', async () => {
      mockApiClient.post.mockResolvedValue({ data: { uid: '123' } });

      await AdminAPI.createAdmin({ email: 'admin@example.com' });

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/admin',
        { email: 'admin@example.com' }
      );
    });

    it('should send email in request body', async () => {
      mockApiClient.post.mockResolvedValue({ data: { uid: '123' } });

      const payload = { email: 'neoadmin@example.com' };
      await AdminAPI.createAdmin(payload);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/admin',
        payload
      );
    });

    it('should return void on success', async () => {
      mockApiClient.post.mockResolvedValue({ data: { uid: '123' } });

      const result = await AdminAPI.createAdmin({ email: 'test@example.com' });

      expect(result).toBeUndefined();
    });

    it('should handle create admin error', async () => {
      mockApiClient.post.mockRejectedValue(new Error('Email already exists'));

      await expect(
        AdminAPI.createAdmin({ email: 'existing@example.com' })
      ).rejects.toThrow('Email already exists');
    });
  });

  describe('deleteAdmin', () => {
    it('should call delete endpoint with admin uid', async () => {
      mockApiClient.delete.mockResolvedValue({ data: {} });

      await AdminAPI.deleteAdmin('admin-123');

      expect(mockApiClient.delete).toHaveBeenCalledWith(
        '/admin/admin-123'
      );
    });

    it('should handle different admin uids', async () => {
      mockApiClient.delete.mockResolvedValue({ data: {} });

      await AdminAPI.deleteAdmin('another-uid');

      expect(mockApiClient.delete).toHaveBeenCalledWith(
        '/admin/another-uid'
      );
    });

    it('should return void on success', async () => {
      mockApiClient.delete.mockResolvedValue({ data: {} });

      const result = await AdminAPI.deleteAdmin('admin-123');

      expect(result).toBeUndefined();
    });

    it('should handle delete error', async () => {
      mockApiClient.delete.mockRejectedValue(new Error('Admin not found'));

      await expect(
        AdminAPI.deleteAdmin('nonexistent-uid')
      ).rejects.toThrow('Admin not found');
    });
  });

  describe('activateAdmin', () => {
    it('should call patch endpoint with activation payload', async () => {
      mockApiClient.patch.mockResolvedValue({ data: { uid: '123' } });

      await AdminAPI.activateAdmin({ token: 'token-123', password: 'pass123' });

      expect(mockApiClient.patch).toHaveBeenCalledWith(
        '/admins/activate',
        { token: 'token-123', password: 'pass123' }
      );
    });

    it('should handle different tokens and passwords', async () => {
      mockApiClient.patch.mockResolvedValue({ data: { uid: '456' } });

      await AdminAPI.activateAdmin({ token: 'token-456', password: 'newpass456' });

      expect(mockApiClient.patch).toHaveBeenCalledWith(
        '/admins/activate',
        { token: 'token-456', password: 'newpass456' }
      );
    });

    it('should return void on success', async () => {
      mockApiClient.patch.mockResolvedValue({ data: { uid: '123' } });

      const result = await AdminAPI.activateAdmin({ token: 'token-123', password: 'pass123' });

      expect(result).toBeUndefined();
    });

    it('should handle activation error', async () => {
      mockApiClient.patch.mockRejectedValue(new Error('Invalid token'));

      await expect(
        AdminAPI.activateAdmin({ token: 'invalid', password: 'pass' })
      ).rejects.toThrow('Invalid token');
    });

    it('should handle weak password error', async () => {
      mockApiClient.patch.mockRejectedValue(new Error('Password is too weak'));

      await expect(
        AdminAPI.activateAdmin({ token: 'token-123', password: 'weak' })
      ).rejects.toThrow('Password is too weak');
    });
  });

  describe('error handling', () => {
    it('should throw error when API call fails', async () => {
      mockApiClient.get.mockRejectedValue(new Error('API Error'));

      await expect(AdminAPI.listAdmins({})).rejects.toThrow('API Error');
    });

    it('should throw error on network failure', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Network timeout'));

      await expect(AdminAPI.listAdmins({})).rejects.toThrow('Network timeout');
    });

    it('should handle 404 not found', async () => {
      const error = new Error('Not found');
      (error as any).response = { status: 404 };
      mockApiClient.get.mockRejectedValue(error);

      await expect(AdminAPI.listAdmins({})).rejects.toThrow();
    });

    it('should handle 500 server error', async () => {
      const error = new Error('Server error');
      (error as any).response = { status: 500 };
      mockApiClient.get.mockRejectedValue(error);

      await expect(AdminAPI.listAdmins({})).rejects.toThrow();
    });

    it('should handle 401 unauthorized', async () => {
      const error = new Error('Unauthorized');
      (error as any).response = { status: 401 };
      mockApiClient.get.mockRejectedValue(error);

      await expect(AdminAPI.listAdmins({})).rejects.toThrow();
    });

    it('should handle 403 forbidden', async () => {
      const error = new Error('Forbidden');
      (error as any).response = { status: 403 };
      mockApiClient.get.mockRejectedValue(error);

      await expect(AdminAPI.listAdmins({})).rejects.toThrow();
    });
  });

  describe('pagination edge cases', () => {
    it('should handle page 1 default', async () => {
      const mockResponse = {
        content: [],
        total_rows: 0,
        current_page: 1,
        total_pages: 1,
      };
      
      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await AdminAPI.listAdmins({ search: undefined, page: undefined, page_size: undefined });

      expect(result.current_page).toBe(1);
    });

    it('should handle zero results', async () => {
      const mockResponse = {
        content: [],
        total_rows: 0,
        current_page: 1,
        total_pages: 0,
      };
      
      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await AdminAPI.listAdmins({});

      expect(result.total_rows).toBe(0);
      expect(result.content).toHaveLength(0);
    });

    it('should handle large page numbers', async () => {
      const mockResponse = {
        content: [],
        total_rows: 100,
        current_page: 100,
        total_pages: 100,
      };
      
      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await AdminAPI.listAdmins({ page: 100, page_size: 1 });

      expect(result.current_page).toBe(100);
    });
  });

  describe('API response data extraction', () => {
    it('should extract data correctly from nested response', async () => {
      const mockResponse = {
        content: [{ uid: '1', email: 'test@example.com' }],
        total_rows: 1,
        current_page: 1,
        total_pages: 1,
      };
      
      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await AdminAPI.listAdmins({});

      expect(result).toEqual(mockResponse);
      expect(result.content).toBeDefined();
    });

    it('should handle empty content list', async () => {
      const mockResponse = {
        content: [],
        total_rows: 0,
        current_page: 1,
        total_pages: 0,
      };
      
      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await AdminAPI.listAdmins({});

      expect(result.content).toEqual([]);
      expect(result.total_rows).toBe(0);
    });

    it('should extract admin fields correctly', async () => {
      const mockResponse = {
        content: [
          { uid: '1', email: 'admin1@test.com', full_name: 'Admin One', status: 'active' },
          { uid: '2', email: 'admin2@test.com', full_name: 'Admin Two', status: 'inactive' },
        ],
        total_rows: 2,
        current_page: 1,
        total_pages: 1,
      };
      
      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await AdminAPI.listAdmins({});

      expect(result.content[0].uid).toBe('1');
      expect(result.content[0].email).toBe('admin1@test.com');
      expect(result.content[1].status).toBe('inactive');
    });
  });

  describe('createAdmin edge cases', () => {
    it('should handle special characters in email', async () => {
      mockApiClient.post.mockResolvedValue({ data: { uid: 'new-admin' } });

      const specialEmail = 'admin+test@example.co.uk';
      await AdminAPI.createAdmin({ email: specialEmail });

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/admin',
        { email: specialEmail }
      );
    });

    it('should handle uppercase email addresses', async () => {
      mockApiClient.post.mockResolvedValue({ data: { uid: 'new-admin' } });

      await AdminAPI.createAdmin({ email: 'ADMIN@EXAMPLE.COM' });

      expect(mockApiClient.post).toHaveBeenCalled();
    });

    it('should handle very long email addresses', async () => {
      mockApiClient.post.mockResolvedValue({ data: { uid: 'new-admin' } });

      const longEmail = 'very.long.email.prefix.test@subdomain.example.co.uk';
      await AdminAPI.createAdmin({ email: longEmail });

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/admin',
        { email: longEmail }
      );
    });
  });

  describe('deActivateAdmin', () => {
    it('should call delete endpoint with deactivate path', async () => {
      mockApiClient.delete.mockResolvedValue({ data: {} });

      await AdminAPI.deActivateAdmin('admin-123');

      expect(mockApiClient.delete).toHaveBeenCalledWith(
        '/admin/admin-123/deactivate'
      );
    });

    it('should handle different admin uids for deactivation', async () => {
      mockApiClient.delete.mockResolvedValue({ data: {} });

      await AdminAPI.deActivateAdmin('another-uid');

      expect(mockApiClient.delete).toHaveBeenCalledWith(
        '/admin/another-uid/deactivate'
      );
    });

    it('should return void on successful deactivation', async () => {
      mockApiClient.delete.mockResolvedValue({ data: {} });

      const result = await AdminAPI.deActivateAdmin('admin-456');

      expect(result).toBeUndefined();
    });

    it('should handle deactivation error', async () => {
      mockApiClient.delete.mockRejectedValue(new Error('Admin not found'));

      await expect(AdminAPI.deActivateAdmin('invalid-uid')).rejects.toThrow(
        'Admin not found'
      );
    });

    it('should handle multiple deactivation requests', async () => {
      mockApiClient.delete.mockResolvedValue({ data: {} });

      await AdminAPI.deActivateAdmin('admin-1');
      await AdminAPI.deActivateAdmin('admin-2');
      await AdminAPI.deActivateAdmin('admin-3');

      expect(mockApiClient.delete).toHaveBeenCalledTimes(3);
    });
  });

  describe('error handling across all methods', () => {
    it('should handle 403 forbidden on list admins', async () => {
      const error = new Error('Forbidden');
      (error as any).response = { status: 403 };
      mockApiClient.get.mockRejectedValue(error);

      await expect(AdminAPI.listAdmins({})).rejects.toThrow();
    });

    it('should handle 403 forbidden on create admin', async () => {
      const error = new Error('Forbidden');
      (error as any).response = { status: 403 };
      mockApiClient.post.mockRejectedValue(error);

      await expect(
        AdminAPI.createAdmin({ email: 'test@example.com' })
      ).rejects.toThrow();
    });

    it('should handle 403 forbidden on delete admin', async () => {
      const error = new Error('Forbidden');
      (error as any).response = { status: 403 };
      mockApiClient.delete.mockRejectedValue(error);

      await expect(AdminAPI.deleteAdmin('admin-123')).rejects.toThrow();
    });

    it('should handle 403 forbidden on activate admin', async () => {
      const error = new Error('Forbidden');
      (error as any).response = { status: 403 };
      mockApiClient.patch.mockRejectedValue(error);

      await expect(
        AdminAPI.activateAdmin({ token: 'token-123', password: 'pass123' })
      ).rejects.toThrow();
    });

    it('should handle 403 forbidden on deactivate admin', async () => {
      const error = new Error('Forbidden');
      (error as any).response = { status: 403 };
      mockApiClient.delete.mockRejectedValue(error);

      await expect(AdminAPI.deActivateAdmin('admin-123')).rejects.toThrow();
    });
  });

  describe('API interaction patterns', () => {
    it('should build correct list admins URL with page parameters', async () => {
      mockApiClient.get.mockResolvedValue({
        data: {
          data: {
            content: [],
            total_rows: 0,
            current_page: 1,
            total_pages: 1,
          },
        },
      });

      await AdminAPI.listAdmins({ page: 5, page_size: 50 });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin',
        {
          params: {
            search: undefined,
            page: 5,
            page_size: 50,
          },
        }
      );
    });

    it('should handle admin API responses correctly', async () => {
      const mockAdmin = {
        uid: 'admin-123',
        email: 'admin@example.com',
        full_name: 'Admin User',
        status: 'active',
      };

      mockApiClient.post.mockResolvedValue({ data: { data: mockAdmin } });

      await AdminAPI.createAdmin({ email: 'admin@example.com' });

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/admin',
        { email: 'admin@example.com' }
      );
    });

    it('should sequence multiple admin operations', async () => {
      mockApiClient.get.mockResolvedValue({
        data: { data: { content: [], total_rows: 0, current_page: 1, total_pages: 1 } },
      });
      mockApiClient.post.mockResolvedValue({ data: { uid: '123' } });
      mockApiClient.delete.mockResolvedValue({ data: {} });

      // Create sequence
      await AdminAPI.listAdmins({});
      await AdminAPI.createAdmin({ email: 'new@example.com' });
      await AdminAPI.deleteAdmin('old-uid');

      expect(mockApiClient.get).toHaveBeenCalled();
      expect(mockApiClient.post).toHaveBeenCalled();
      expect(mockApiClient.delete).toHaveBeenCalled();
    });
  });

  describe('API request consistency and correctness', () => {
    it('should use GET for listing', async () => {
      mockApiClient.get.mockResolvedValue({
        data: { data: { content: [], total_rows: 0, current_page: 1, total_pages: 0 } },
      });

      await AdminAPI.listAdmins({});
      expect(mockApiClient.get).toHaveBeenCalled();
    });

    it('should use POST for creation', async () => {
      mockApiClient.post.mockResolvedValue({ data: {} });

      await AdminAPI.createAdmin({ email: 'test@test.com' });
      expect(mockApiClient.post).toHaveBeenCalled();
    });

    it('should use DELETE for deletion', async () => {
      mockApiClient.delete.mockResolvedValue({ data: {} });

      await AdminAPI.deleteAdmin('admin-123');
      expect(mockApiClient.delete).toHaveBeenCalled();
    });

    it('should use PATCH for activation', async () => {
      mockApiClient.patch.mockResolvedValue({ data: {} });

      await AdminAPI.activateAdmin({ token: 't', password: 'p' });
      expect(mockApiClient.patch).toHaveBeenCalled();
    });
  });

  describe('URL format validation', () => {
    it('should use /admin endpoint for listing', async () => {
      mockApiClient.get.mockResolvedValue({
        data: { data: { content: [], total_rows: 0, current_page: 1, total_pages: 0 } },
      });

      await AdminAPI.listAdmins({});
      expect(mockApiClient.get).toHaveBeenCalledWith('/admin', expect.anything());
    });

    it('should use /admin endpoint for creation', async () => {
      mockApiClient.post.mockResolvedValue({ data: {} });

      await AdminAPI.createAdmin({ email: 'test@test.com' });
      expect(mockApiClient.post).toHaveBeenCalledWith('/admin', expect.anything());
    });

    it('should construct correct delete URL with UID', async () => {
      mockApiClient.delete.mockResolvedValue({ data: {} });

      await AdminAPI.deleteAdmin('uid-abc-123');
      expect(mockApiClient.delete).toHaveBeenCalledWith('/admin/uid-abc-123');
    });

    it('should use /admins/activate for activation', async () => {
      mockApiClient.patch.mockResolvedValue({ data: {} });

      await AdminAPI.activateAdmin({ token: 't', password: 'p' });
      expect(mockApiClient.patch).toHaveBeenCalledWith('/admins/activate', expect.anything());
    });

    it('should construct deactivate URL with /deactivate suffix', async () => {
      mockApiClient.delete.mockResolvedValue({ data: {} });

      await AdminAPI.deActivateAdmin('uid-xyz-789');
      expect(mockApiClient.delete).toHaveBeenCalledWith('/admin/uid-xyz-789/deactivate');
    });
  });

  describe('error scenarios', () => {
    it('should propagate 422 validation errors', async () => {
      const error = new Error('Validation error');
      (error as any).response = { status: 422, data: { message: 'Invalid email' } };
      mockApiClient.post.mockRejectedValue(error);

      await expect(AdminAPI.createAdmin({ email: 'invalid' })).rejects.toThrow();
    });

    it('should propagate 429 rate limit errors', async () => {
      const error = new Error('Too many requests');
      (error as any).response = { status: 429 };
      mockApiClient.post.mockRejectedValue(error);

      await expect(AdminAPI.createAdmin({ email: 'test@test.com' })).rejects.toThrow();
    });

    it('should handle 503 service unavailable', async () => {
      const error = new Error('Service Unavailable');
      (error as any).response = { status: 503 };
      mockApiClient.get.mockRejectedValue(error);

      await expect(AdminAPI.listAdmins({})).rejects.toThrow();
    });

    it('should handle 502 bad gateway', async () => {
      const error = new Error('Bad Gateway');
      (error as any).response = { status: 502 };
      mockApiClient.get.mockRejectedValue(error);

      await expect(AdminAPI.listAdmins({})).rejects.toThrow();
    });
  });

  describe('response validation', () => {
    it('should return response with proper structure', async () => {
      const mockResponse = {
        content: [{ uid: '1', email: 'a@test.com' }],
        total_rows: 1,
        current_page: 1,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });
      const result = await AdminAPI.listAdmins({});

      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('total_rows');
      expect(result).toHaveProperty('current_page');
      expect(result).toHaveProperty('total_pages');
    });

    it('should handle response with no admins', async () => {
      mockApiClient.get.mockResolvedValue({
        data: { data: { content: [], total_rows: 0, current_page: 1, total_pages: 0 } },
      });

      const result = await AdminAPI.listAdmins({});
      expect(result.content).toHaveLength(0);
    });

    it('should preserve admin data in response', async () => {
      const admin = { uid: 'test-id', email: 'admin@test.com', full_name: 'Test Admin' };
      mockApiClient.get.mockResolvedValue({
        data: { data: { content: [admin], total_rows: 1, current_page: 1, total_pages: 1 } },
      });

      const result = await AdminAPI.listAdmins({});
      expect(result.content[0]).toEqual(admin);
    });
  });
});
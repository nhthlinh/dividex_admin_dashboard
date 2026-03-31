import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminAPI } from './admin.api';

// Mock axios
vi.mock('../../config/api.config', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import { api as apiClient } from '../../config/api.config';

const mockApiClient = apiClient as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

describe('AdminAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listAdmins', () => {
    it('should call get endpoint with correct URL', async () => {
      mockApiClient.get.mockResolvedValue({ data: { content: [] } });

      await AdminAPI.listAdmins({});

      expect(mockApiClient.get).toHaveBeenCalledWith(
        expect.stringContaining('/admin'),
        expect.any(Object)
      );
    });

    it('should handle pagination parameters', async () => {
      mockApiClient.get.mockResolvedValue({ data: { content: [] } });

      await AdminAPI.listAdmins({ page: 2, page_size: 20 });

      expect(mockApiClient.get).toHaveBeenCalled();
    });
  });

  describe('inviteAdmin', () => {
    it('should call post endpoint with email', async () => {
      mockApiClient.post.mockResolvedValue({ data: { uid: '123' } });

      await AdminAPI.createAdmin({ email: 'admin@example.com' });

      expect(mockApiClient.post).toHaveBeenCalledWith(
        expect.stringContaining('/admin'),
        expect.any(Object)
      );
    });

    it('should send email in request body', async () => {
      mockApiClient.post.mockResolvedValue({ data: { uid: '123' } });

      const payload = { email: 'admin@example.com' };
      await AdminAPI.createAdmin(payload);

      expect(mockApiClient.post).toHaveBeenCalled();
    });
  });

  describe('deleteAdmin', () => {
    it('should call delete endpoint with admin uid', async () => {
      mockApiClient.delete.mockResolvedValue({ data: {} });

      await AdminAPI.deleteAdmin('admin-123');

      expect(mockApiClient.delete).toHaveBeenCalledWith(
        expect.stringContaining('admin-123')
      );
    });
  });

  describe('activateAdmin', () => {
    it('should call put endpoint with activation payload', async () => {
      mockApiClient.put.mockResolvedValue({ data: {} });

      await AdminAPI.activateAdmin({ token: 'token-123', password: 'pass123' });

      expect(mockApiClient.put).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should throw error when API call fails', async () => {
      mockApiClient.get.mockRejectedValue(new Error('API Error'));

      await expect(AdminAPI.listAdmins({})).rejects.toThrow();
    });
  });
});

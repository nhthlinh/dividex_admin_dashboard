import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthAPI } from './auth.api';

// Mock axios
vi.mock('../../config/api.config', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

import { api as apiClient } from '../../config/api.config';

const mockApiClient = apiClient as unknown as {
  post: ReturnType<typeof vi.fn>;
};

describe('AuthAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should call post endpoint with email and password', async () => {
      mockApiClient.post.mockResolvedValue({
        data: {
          access_token: 'token123',
          user: { uid: '1', email: 'test@example.com' },
        },
      });

      const result = await AuthAPI.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(mockApiClient.post).toHaveBeenCalledWith(
        expect.stringContaining('/login'),
        expect.any(Object)
      );
      expect(result.access_token).toBe('token123');
    });

    it('should return access token and user info', async () => {
      const mockResponse = {
        access_token: 'token123',
        user: { uid: '1', email: 'test@example.com', full_name: 'Test User' },
      };

      mockApiClient.post.mockResolvedValue({ data: mockResponse });

      const result = await AuthAPI.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual(mockResponse);
    });

    it('should handle login errors', async () => {
      mockApiClient.post.mockRejectedValue(new Error('Invalid credentials'));

      await expect(
        AuthAPI.login({ email: 'test@example.com', password: 'wrong' })
      ).rejects.toThrow();
    });
  });

  describe('error handling', () => {
    it('should throw error on API failure', async () => {
      mockApiClient.post.mockRejectedValue(new Error('Network error'));

      await expect(
        AuthAPI.login({ email: 'test@example.com', password: 'pass123' })
      ).rejects.toThrow('Network error');
    });
  });
});

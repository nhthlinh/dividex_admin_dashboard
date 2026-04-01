import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthAPI } from './auth.api';

// Mock axios
vi.mock('../../config/api.config', () => ({
  api: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

// Mock the mockApi
vi.mock('../../services/mockApi', () => ({
  mockApi: {
    login: vi.fn(),
  },
  USE_MOCK: false,
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
    it('should call post endpoint with correct URL', async () => {
      const mockResponse = {
        access_token: 'token123',
        user: { uid: '1', email: 'test@example.com' },
      };
      
      mockApiClient.post.mockResolvedValue({
        data: {
          data: mockResponse,
        },
      });

      await AuthAPI.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/auth/login',
        expect.objectContaining({ email: 'test@example.com', password: 'password123' })
      );
    });

    it('should send email and password in request body', async () => {
      const mockResponse = {
        access_token: 'token123',
        user: { uid: '1', email: 'user@example.com' },
      };
      
      mockApiClient.post.mockResolvedValue({ data: { data: mockResponse } });

      const loginPayload = {
        email: 'user@example.com',
        password: 'securePass123',
      };

      await AuthAPI.login(loginPayload);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/auth/login',
        loginPayload
      );
    });

    it('should return access token and user info', async () => {
      const mockResponse = {
        access_token: 'token123',
        user: { uid: '1', email: 'test@example.com', full_name: 'Test User' },
      };

      mockApiClient.post.mockResolvedValue({ data: { data: mockResponse } });

      const result = await AuthAPI.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual(mockResponse);
      expect(result.access_token).toBe('token123');
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.full_name).toBe('Test User');
    });

    it('should return user id', async () => {
      const mockResponse = {
        access_token: 'token-abc',
        user: { uid: 'user-456', email: 'admin@example.com' },
      };

      mockApiClient.post.mockResolvedValue({ data: { data: mockResponse } });

      const result = await AuthAPI.login({
        email: 'admin@example.com',
        password: 'adminpass',
      });

      expect(result.user.uid).toBe('user-456');
    });

    it('should handle different user data', async () => {
      const mockResponse = {
        access_token: 'different-token',
        user: {
          uid: '999',
          email: 'another@test.com',
          full_name: 'Another User',
          role: 'admin',
        },
      };

      mockApiClient.post.mockResolvedValue({ data: { data: mockResponse } });

      const result = await AuthAPI.login({
        email: 'another@test.com',
        password: 'pass',
      });

      expect(result.user.role).toBe('admin');
    });

    it('should throw error on invalid credentials', async () => {
      mockApiClient.post.mockRejectedValue(new Error('Invalid credentials'));

      await expect(
        AuthAPI.login({ email: 'test@example.com', password: 'wrong' })
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw error on network failure', async () => {
      mockApiClient.post.mockRejectedValue(new Error('Network error'));

      await expect(
        AuthAPI.login({ email: 'test@example.com', password: 'pass123' })
      ).rejects.toThrow('Network error');
    });

    it('should handle 401 unauthorized', async () => {
      const error = new Error('Unauthorized');
      (error as any).response = { status: 401, data: { message: 'Invalid credentials' } };
      mockApiClient.post.mockRejectedValue(error);

      await expect(
        AuthAPI.login({ email: 'test@example.com', password: 'wrong' })
      ).rejects.toThrow('Unauthorized');
    });

    it('should handle 500 server error', async () => {
      const error = new Error('Internal server error');
      (error as any).response = { status: 500 };
      mockApiClient.post.mockRejectedValue(error);

      await expect(
        AuthAPI.login({ email: 'test@example.com', password: 'pass' })
      ).rejects.toThrow('Internal server error');
    });

    it('should handle empty email', async () => {
      const error = new Error('Email is required');
      mockApiClient.post.mockRejectedValue(error);

      await expect(
        AuthAPI.login({ email: '', password: 'pass' })
      ).rejects.toThrow('Email is required');
    });

    it('should handle empty password', async () => {
      const error = new Error('Password is required');
      mockApiClient.post.mockRejectedValue(error);

      await expect(
        AuthAPI.login({ email: 'test@example.com', password: '' })
      ).rejects.toThrow('Password is required');
    });

    it('should extract token from nested response structure', async () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
      const mockResponse = {
        access_token: token,
        user: { uid: '1', email: 'test@example.com' },
      };

      mockApiClient.post.mockResolvedValue({ data: { data: mockResponse } });

      const result = await AuthAPI.login({
        email: 'test@example.com',
        password: 'pass',
      });

      expect(result.access_token).toBe(token);
      expect(result.access_token).toMatch(/^eyJ/);
    });

    it('should handle timeout error', async () => {
      mockApiClient.post.mockRejectedValue(new Error('Request timeout'));

      await expect(
        AuthAPI.login({ email: 'test@example.com', password: 'pass' })
      ).rejects.toThrow('Request timeout');
    });

    it('should handle connection refused', async () => {
      mockApiClient.post.mockRejectedValue(new Error('Connection refused'));

      await expect(
        AuthAPI.login({ email: 'test@example.com', password: 'pass' })
      ).rejects.toThrow('Connection refused');
    });

    it('should preserve user object structure', async () => {
      const mockResponse = {
        access_token: 'token',
        user: {
          uid: '1',
          email: 'test@example.com',
          full_name: 'Test User',
          role: 'user',
          avatar_url: 'https://example.com/avatar.jpg',
        },
      };

      mockApiClient.post.mockResolvedValue({ data: { data: mockResponse } });

      const result = await AuthAPI.login({
        email: 'test@example.com',
        password: 'pass',
      });

      expect(result.user).toHaveProperty('uid');
      expect(result.user).toHaveProperty('email');
      expect(result.user).toHaveProperty('full_name');
      expect(result.user).toHaveProperty('role');
    });

    it('should return response data without extra wrapper', async () => {
      const mockResponse = {
        access_token: 'token',
        user: { uid: '1', email: 'test@example.com' },
      };

      mockApiClient.post.mockResolvedValue({ data: { data: mockResponse } });

      const result = await AuthAPI.login({
        email: 'test@example.com',
        password: 'pass',
      });

      // Should be the inner response, not wrapped
      expect(result).not.toHaveProperty('data');
      expect(result).toEqual(mockResponse);
    });

    it('should call API exactly once', async () => {
      mockApiClient.post.mockResolvedValue({
        data: { data: { access_token: 'token', user: { uid: '1', email: 'test@example.com' } } },
      });

      await AuthAPI.login({ email: 'test@example.com', password: 'pass' });

      expect(mockApiClient.post).toHaveBeenCalledTimes(1);
    });

    it('should handle special characters in email', async () => {
      const mockResponse = {
        access_token: 'token',
        user: { uid: '1', email: 'test+tag@example.com' },
      };

      mockApiClient.post.mockResolvedValue({ data: { data: mockResponse } });

      const result = await AuthAPI.login({
        email: 'test+tag@example.com',
        password: 'pass',
      });

      expect(result.user.email).toBe('test+tag@example.com');
    });
  });

  describe('error handling', () => {
    it('should throw error on API failure', async () => {
      mockApiClient.post.mockRejectedValue(new Error('Network error'));

      await expect(
        AuthAPI.login({ email: 'test@example.com', password: 'pass123' })
      ).rejects.toThrow('Network error');
    });

    it('should handle CORS errors', async () => {
      mockApiClient.post.mockRejectedValue(new Error('CORS policy violation'));

      await expect(
        AuthAPI.login({ email: 'test@example.com', password: 'pass' })
      ).rejects.toThrow('CORS policy violation');
    });

    it('should handle invalid JSON response', async () => {
      mockApiClient.post.mockRejectedValue(new Error('Invalid JSON'));

      await expect(
        AuthAPI.login({ email: 'test@example.com', password: 'pass' })
      ).rejects.toThrow('Invalid JSON');
    });

    it('should handle account locked error', async () => {
      mockApiClient.post.mockRejectedValue(new Error('Account is locked'));

      await expect(
        AuthAPI.login({ email: 'test@example.com', password: 'pass' })
      ).rejects.toThrow('Account is locked');
    });
  });

  describe('login endpoint validation', () => {
    it('should use correct endpoint path', async () => {
      mockApiClient.post.mockResolvedValue({
        data: { data: { access_token: 'token', user: { uid: '1', email: 'test@example.com' } } },
      });

      await AuthAPI.login({ email: 'test@example.com', password: 'pass' });

      const call = mockApiClient.post.mock.calls[0];
      expect(call[0]).toBe('/auth/login');
    });

    it('should pass credentials in correct order', async () => {
      mockApiClient.post.mockResolvedValue({
        data: { data: { access_token: 'token', user: { uid: '1', email: 'test@example.com' } } },
      });

      await AuthAPI.login({ email: 'email@test.com', password: 'mypass' });

      const payload = mockApiClient.post.mock.calls[0][1];
      expect(payload.email).toBe('email@test.com');
      expect(payload.password).toBe('mypass');
    });
  });

  describe('response structure validation', () => {
    it('should contain both access token and user', async () => {
      const mockResponse = {
        access_token: 'token123',
        user: { uid: '1', email: 'test@example.com' },
      };

      mockApiClient.post.mockResolvedValue({ data: { data: mockResponse } });

      const result = await AuthAPI.login({ email: 'test@example.com', password: 'pass' });

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
    });

    it('should have non-empty access token', async () => {
      const mockResponse = {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U',
        user: { uid: '1', email: 'test@example.com' },
      };

      mockApiClient.post.mockResolvedValue({ data: { data: mockResponse } });

      const result = await AuthAPI.login({ email: 'test@example.com', password: 'pass' });

      expect(result.access_token.length).toBeGreaterThan(0);
    });

    it('should return user with required fields', async () => {
      const mockResponse = {
        access_token: 'token',
        user: {
          uid: '123',
          email: 'user@test.com',
          full_name: 'Test User',
        },
      };

      mockApiClient.post.mockResolvedValue({ data: { data: mockResponse } });

      const result = await AuthAPI.login({ email: 'user@test.com', password: 'pass' });

      expect(result.user.uid).toBeDefined();
      expect(result.user.email).toBeDefined();
    });
  });

  describe('login credentials validation', () => {
    it('should accept valid email format', async () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.co.uk',
        'test+alias@example.com',
      ];

      mockApiClient.post.mockResolvedValue({
        data: { data: { access_token: 'token', user: { uid: '1', email: 'test@example.com' } } },
      });

      for (const email of validEmails) {
        await AuthAPI.login({ email, password: 'pass' });
      }

      expect(mockApiClient.post).toHaveBeenCalledTimes(3);
    });

    it('should accept password of any length', async () => {
      mockApiClient.post.mockResolvedValue({
        data: { data: { access_token: 'token', user: { uid: '1', email: 'test@example.com' } } },
      });

      const passwords = ['a', 'short', 'a-very-long-complex-password-with-special-chars!@#$%'];

      for (const password of passwords) {
        await AuthAPI.login({ email: 'test@example.com', password });
      }

      expect(mockApiClient.post).toHaveBeenCalledTimes(3);
    });
  });

  describe('API response handling', () => {
    it('should return exact response data', async () => {
      const mockResponse = {
        access_token: 'specific-token-12345',
        user: { uid: 'specific-uid', email: 'specific@test.com' },
      };

      mockApiClient.post.mockResolvedValue({ data: { data: mockResponse } });

      const result = await AuthAPI.login({ email: 'test@example.com', password: 'pass' });

      expect(result).toEqual(mockResponse);
    });

    it('should not modify response data', async () => {
      const mockResponse = {
        access_token: 'token',
        user: { uid: '1', email: 'test@example.com', metadata: { extra: 'data' } },
      };

      mockApiClient.post.mockResolvedValue({ data: { data: mockResponse } });

      const result = await AuthAPI.login({ email: 'test@example.com', password: 'pass' });

      expect(result).toStrictEqual(mockResponse);
    });

    it('should handle large access tokens', async () => {
      const longToken = 'x'.repeat(1000);
      const mockResponse = {
        access_token: longToken,
        user: { uid: '1', email: 'test@example.com' },
      };

      mockApiClient.post.mockResolvedValue({ data: { data: mockResponse } });

      const result = await AuthAPI.login({ email: 'test@example.com', password: 'pass' });

      expect(result.access_token).toBe(longToken);
    });
  });

  describe('HTTP status codes', () => {
    it('should handle 401 Unauthorized', async () => {
      const error = new Error('Unauthorized');
      (error as any).response = { status: 401 };
      mockApiClient.post.mockRejectedValue(error);

      await expect(
        AuthAPI.login({ email: 'test@example.com', password: 'wrong' })
      ).rejects.toThrow();
    });

    it('should handle 400 Bad Request', async () => {
      const error = new Error('Bad Request');
      (error as any).response = { status: 400 };
      mockApiClient.post.mockRejectedValue(error);

      await expect(
        AuthAPI.login({ email: 'test@example.com', password: 'pass' })
      ).rejects.toThrow();
    });

    it('should handle 429 Too Many Requests', async () => {
      const error = new Error('Too Many Requests');
      (error as any).response = { status: 429 };
      mockApiClient.post.mockRejectedValue(error);

      await expect(
        AuthAPI.login({ email: 'test@example.com', password: 'pass' })
      ).rejects.toThrow();
    });

    it('should handle 503 Service Unavailable', async () => {
      const error = new Error('Service Unavailable');
      (error as any).response = { status: 503 };
      mockApiClient.post.mockRejectedValue(error);

      await expect(
        AuthAPI.login({ email: 'test@example.com', password: 'pass' })
      ).rejects.toThrow();
    });
  });

  describe('login method consistency', () => {
    it('should always return response from API', async () => {
      const mockResponse = {
        access_token: 'token',
        user: { uid: '1', email: 'test@example.com' },
      };

      mockApiClient.post.mockResolvedValue({ data: { data: mockResponse } });

      const result = await AuthAPI.login({ email: 'test@example.com', password: 'pass' });

      expect(result).toBeTruthy();
      expect(typeof result).toBe('object');
    });

    it('should always use POST method', async () => {
      mockApiClient.post.mockResolvedValue({
        data: { data: { access_token: 'token', user: { uid: '1', email: 'test@example.com' } } },
      });

      await AuthAPI.login({ email: 'test@example.com', password: 'pass' });

      expect(mockApiClient.post).toHaveBeenCalled();
    });
  });
});


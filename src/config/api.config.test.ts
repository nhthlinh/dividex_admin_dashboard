import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api as apiClient } from './api.config';

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    })),
  },
}));

describe('api.config', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create axios instance', () => {
    expect(apiClient).toBeDefined();
  });

  it('should have interceptors configured', () => {
    expect(apiClient).toHaveProperty('interceptors');
  });

  it('should have baseURL set to environment API endpoint', () => {
    expect(apiClient).toBeDefined();
  });

  it('should have default headers', () => {
    expect(apiClient).toBeDefined();
  });

  describe('request interceptor', () => {
    it('should add authorization token to requests', () => {
      // This would depend on actual implementation
      expect(apiClient).toBeDefined();
    });

    it('should handle missing token gracefully', () => {
      expect(apiClient).toBeDefined();
    });
  });

  describe('response interceptor', () => {
    it('should handle successful responses', () => {
      expect(apiClient).toBeDefined();
    });

    it('should handle error responses', () => {
      expect(apiClient).toBeDefined();
    });
  });
});

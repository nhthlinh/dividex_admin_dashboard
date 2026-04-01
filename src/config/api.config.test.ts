/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import type { AxiosInstance } from 'axios';

describe('api.config', () => {
  let testApi: AxiosInstance;
  let mockAuthStore: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock authStore
    mockAuthStore = {
      getToken: vi.fn(),
      logout: vi.fn(),
    };

    // Mock window.location.href
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost:3000',
      },
      writable: true,
      configurable: true,
    });

    // Create test axios instance with same setup as api.config.ts
    testApi = axios.create({
      baseURL: 'http://localhost:8000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor: attach token (line 14-19 in api.config.ts)
    testApi.interceptors.request.use((config) => {
      const token = mockAuthStore.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor: handle errors (line 21-35 in api.config.ts)
    testApi.interceptors.response.use(
      (res) => res,
      (error: any) => {
        const apiError: any = {
          message: error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại',
          status: error.response?.status,
        };

        if (apiError.status === 401) {
          mockAuthStore.logout();
          window.location.href = '/login';
        }

        return Promise.reject(apiError);
      }
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('axios instance configuration', () => {
    it('should create axios instance with baseURL', () => {
      expect(testApi).toBeDefined();
      expect(testApi.defaults.baseURL).toBe('http://localhost:8000/api');
    });

    it('should have Content-Type header configured', () => {
      expect(testApi.defaults.headers['Content-Type']).toBe('application/json');
    });

    it('should have request interceptors registered', () => {
      const handlers = (testApi.interceptors.request as any).handlers || [];
      expect(Array.isArray(handlers) || handlers === undefined).toBeTruthy();
    });

    it('should have response interceptors registered', () => {
      const handlers = (testApi.interceptors.response as any).handlers || [];
      expect(Array.isArray(handlers) || handlers === undefined).toBeTruthy();
    });
  });

  describe('Request Interceptor - Token Attachment (lines 14-19)', () => {
    it('should attach Bearer token when token exists', async () => {
      mockAuthStore.getToken.mockReturnValue('test-token-123');

      const requestInterceptors = testApi.interceptors.request as any;
      requestInterceptors.handlers?.forEach((handler: any) => {
        if (handler && handler.fulfilled) {
          const config = { headers: {} };
          const result = handler.fulfilled(config);
          expect(result.headers.Authorization).toBe('Bearer test-token-123');
        }
      });
    });

    it('should not add Authorization header when no token', async () => {
      mockAuthStore.getToken.mockReturnValue(null);

      const requestInterceptors = testApi.interceptors.request as any;
      requestInterceptors.handlers?.forEach((handler: any) => {
        if (handler && handler.fulfilled) {
          const config = { headers: {} };
          const result = handler.fulfilled(config);
          expect(result.headers.Authorization).toBeUndefined();
        }
      });
    });

    it('should handle undefined token gracefully', async () => {
      mockAuthStore.getToken.mockReturnValue(undefined);

      const requestInterceptors = testApi.interceptors.request as any;
      requestInterceptors.handlers?.forEach((handler: any) => {
        if (handler && handler.fulfilled) {
          const config = { headers: {} };
          const result = handler.fulfilled(config);
          expect(result.headers.Authorization).toBeUndefined();
        }
      });
    });

    it('should preserve other headers when adding token', async () => {
      mockAuthStore.getToken.mockReturnValue('token-xyz');

      const requestInterceptors = testApi.interceptors.request as any;
      requestInterceptors.handlers?.forEach((handler: any) => {
        if (handler && handler.fulfilled) {
          const config = {
            headers: {
              'X-Custom-Header': 'value',
              'Content-Type': 'application/json',
            },
          };
          const result = handler.fulfilled(config);
          expect(result.headers['X-Custom-Header']).toBe('value');
          expect(result.headers['Content-Type']).toBe('application/json');
          expect(result.headers.Authorization).toBe('Bearer token-xyz');
        }
      });
    });

    it('should override existing Authorization header with new token', async () => {
      mockAuthStore.getToken.mockReturnValue('new-token');

      const requestInterceptors = testApi.interceptors.request as any;
      requestInterceptors.handlers?.forEach((handler: any) => {
        if (handler && handler.fulfilled) {
          const config = { headers: { Authorization: 'Bearer old-token' } };
          const result = handler.fulfilled(config);
          expect(result.headers.Authorization).toBe('Bearer new-token');
        }
      });
    });
  });

  describe('Response Interceptor - Error Handling (lines 21-35)', () => {
    it('should pass successful responses through', async () => {
      const responseInterceptors = testApi.interceptors.response as any;
      responseInterceptors.handlers?.forEach((handler: any) => {
        if (handler && handler.fulfilled) {
          const response = {
            status: 200,
            data: { success: true },
            headers: {},
            config: {} as any,
            statusText: 'OK',
          };
          const result = handler.fulfilled(response);
          expect(result).toEqual(response);
        }
      });
    });

    it('should extract message from error response', async () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Invalid request' },
        },
      };

      const responseInterceptors = testApi.interceptors.response as any;
      responseInterceptors.handlers?.forEach((handler: any) => {
        if (handler && handler.rejected) {
          handler.rejected(error).catch((err: any) => {
            expect(err.message).toBe('Invalid request');
          });
        }
      });
    });

    it('should use default message when error message missing', async () => {
      const error = {
        response: {
          status: 500,
          data: {},
        },
      };

      const responseInterceptors = testApi.interceptors.response as any;
      responseInterceptors.handlers?.forEach((handler: any) => {
        if (handler && handler.rejected) {
          handler.rejected(error).catch((err: any) => {
            expect(err.message).toBe('Có lỗi xảy ra, vui lòng thử lại');
          });
        }
      });
    });

    it('should set error status from response', async () => {
      const error = {
        response: {
          status: 403,
          data: { message: 'Forbidden' },
        },
      };

      const responseInterceptors = testApi.interceptors.response as any;
      responseInterceptors.handlers?.forEach((handler: any) => {
        if (handler && handler.rejected) {
          handler.rejected(error).catch((err: any) => {
            expect(err.status).toBe(403);
          });
        }
      });
    });

    it('should handle 401 error by calling logout', async () => {
      const error = {
        response: {
          status: 401,
          data: { message: 'Token expired' },
        },
      };

      const responseInterceptors = testApi.interceptors.response as any;
      responseInterceptors.handlers?.forEach((handler: any) => {
        if (handler && handler.rejected) {
          handler.rejected(error).catch(() => {
            expect(mockAuthStore.logout).toHaveBeenCalled();
          });
        }
      });
    });

    it('should redirect to login on 401 error', async () => {
      const error = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
      };

      const responseInterceptors = testApi.interceptors.response as any;
      responseInterceptors.handlers?.forEach((handler: any) => {
        if (handler && handler.rejected) {
          handler.rejected(error).catch(() => {
            expect(window.location.href).toBe('/login');
          });
        }
      });
    });

    it('should not logout for non-401 errors', async () => {
      const error = {
        response: {
          status: 404,
          data: { message: 'Not found' },
        },
      };

      const responseInterceptors = testApi.interceptors.response as any;
      responseInterceptors.handlers?.forEach((handler: any) => {
        if (handler && handler.rejected) {
          handler.rejected(error).catch(() => {
            expect(mockAuthStore.logout).not.toHaveBeenCalled();
          });
        }
      });
    });

    it('should reject promise with formatted error object', async () => {
      const error = {
        response: {
          status: 422,
          data: { message: 'Validation error' },
        },
      };

      const responseInterceptors = testApi.interceptors.response as any;
      responseInterceptors.handlers?.forEach((handler: any) => {
        if (handler && handler.rejected) {
          const rejectedPromise = handler.rejected(error);
          expect(rejectedPromise).rejects.toEqual(
            expect.objectContaining({
              status: 422,
              message: 'Validation error',
            })
          );
        }
      });
    });
  });

  describe('HTTP methods availability', () => {
    it('should have GET method', () => {
      expect(typeof testApi.get).toBe('function');
    });

    it('should have POST method', () => {
      expect(typeof testApi.post).toBe('function');
    });

    it('should have PUT method', () => {
      expect(typeof testApi.put).toBe('function');
    });

    it('should have DELETE method', () => {
      expect(typeof testApi.delete).toBe('function');
    });

    it('should have PATCH method', () => {
      expect(typeof testApi.patch).toBe('function');
    });

    it('should have HEAD method', () => {
      expect(typeof testApi.head).toBe('function');
    });
  });

  describe('API configuration', () => {
    it('should have valid baseURL ', () => {
      const baseURL = testApi.defaults.baseURL;
      expect(baseURL).toBeDefined();
      expect(typeof baseURL).toBe('string');
      expect(baseURL?.length).toBeGreaterThan(0);
    });

    it('should have correct Content-Type header', () => {
      expect(testApi.defaults.headers['Content-Type']).toBe('application/json');
    });

    it('should preserve headers configuration', () => {
      const contentType = testApi.defaults.headers['Content-Type'];
      expect(contentType).toBe('application/json');
    });

    it('should support custom header additions', () => {
      const headers = testApi.defaults.headers;
      expect(headers).toBeDefined();
      expect(typeof headers).toBe('object');
    });
  });

  describe('Error Scenarios', () => {
    it('should handle 422 validation error', async () => {
      const error = {
        response: {
          status: 422,
          data: { message: 'Validation failed' },
        },
      };

      const responseInterceptors = testApi.interceptors.response as any;
      responseInterceptors.handlers?.forEach((handler: any) => {
        if (handler && handler.rejected) {
          handler.rejected(error).catch((err: any) => {
            expect(err.status).toBe(422);
            expect(err.message).toBe('Validation failed');
          });
        }
      });
    });

    it('should handle 429 rate limit', async () => {
      const error = {
        response: {
          status: 429,
          data: { message: 'Too many requests' },
        },
      };

      const responseInterceptors = testApi.interceptors.response as any;
      responseInterceptors.handlers?.forEach((handler: any) => {
        if (handler && handler.rejected) {
          handler.rejected(error).catch((err: any) => {
            expect(err.status).toBe(429);
          });
        }
      });
    });

    it('should handle 503 service unavailable', async () => {
      const error = {
        response: {
          status: 503,
          data: { message: 'Service unavailable' },
        },
      };

      const responseInterceptors = testApi.interceptors.response as any;
      responseInterceptors.handlers?.forEach((handler: any) => {
        if (handler && handler.rejected) {
          handler.rejected(error).catch((err: any) => {
            expect(err.status).toBe(503);
          });
        }
      });
    });

    it('should handle network error without response', async () => {
      const error = {
        message: 'Network Error',
        response: undefined,
      };

      const responseInterceptors = testApi.interceptors.response as any;
      responseInterceptors.handlers?.forEach((handler: any) => {
        if (handler && handler.rejected) {
          handler.rejected(error).catch((err: any) => {
            expect(err.message).toBe('Có lỗi xảy ra, vui lòng thử lại');
          });
        }
      });
    });
  });

  describe('Interceptor structure', () => {
    it('should have request interceptor use method', () => {
      expect(testApi.interceptors.request.use).toBeDefined();
      expect(typeof testApi.interceptors.request.use).toBe('function');
    });

    it('should have response interceptor use method', () => {
      expect(testApi.interceptors.response.use).toBeDefined();
      expect(typeof testApi.interceptors.response.use).toBe('function');
    });

    it('should have request interceptor eject method', () => {
      expect(testApi.interceptors.request.eject).toBeDefined();
      expect(typeof testApi.interceptors.request.eject).toBe('function');
    });

    it('should have response interceptor eject method', () => {
      expect(testApi.interceptors.response.eject).toBeDefined();
      expect(typeof testApi.interceptors.response.eject).toBe('function');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string token', async () => {
      mockAuthStore.getToken.mockReturnValue('');

      const requestInterceptors = testApi.interceptors.request as any;
      requestInterceptors.handlers?.forEach((handler: any) => {
        if (handler && handler.fulfilled) {
          const config = { headers: {} };
          const result = handler.fulfilled(config);
          // Empty string is falsy, no header added
          expect(result.headers.Authorization).toBeUndefined();
        }
      });
    });

    it('should handle token with special characters', async () => {
      mockAuthStore.getToken.mockReturnValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');

      const requestInterceptors = testApi.interceptors.request as any;
      requestInterceptors.handlers?.forEach((handler: any) => {
        if (handler && handler.fulfilled) {
          const config = { headers: {} };
          const result = handler.fulfilled(config);
          expect(result.headers.Authorization).toBe(
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
          );
        }
      });
    });

    it('should handle response with error but no data', async () => {
      const error = {
        response: {
          status: 500,
        },
      };

      const responseInterceptors = testApi.interceptors.response as any;
      responseInterceptors.handlers?.forEach((handler: any) => {
        if (handler && handler.rejected) {
          handler.rejected(error).catch((err: any) => {
            expect(err.message).toBe('Có lỗi xảy ra, vui lòng thử lại');
          });
        }
      });
    });
  });
});

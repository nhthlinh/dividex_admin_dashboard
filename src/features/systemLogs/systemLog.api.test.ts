/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SystemLogAPI } from './systemLog.api';

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
    listSystemLogs: vi.fn(),
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

describe('SystemLogAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getLogs', () => {
    it('should call get endpoint with default params', async () => {
      const mockResponse = {
        content: [],
        current_page: 1,
        page_size: 10,
        total_rows: 0,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await SystemLogAPI.getLogs();

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/logs/',
        { params: undefined }
      );
    });

    it('should handle pagination params', async () => {
      const mockResponse = {
        content: [],
        current_page: 2,
        page_size: 20,
        total_rows: 50,
        total_pages: 3,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await SystemLogAPI.getLogs({ page: 2, page_size: 20 });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/logs/',
        { params: { page: 2, page_size: 20 } }
      );
      expect(result.current_page).toBe(2);
      expect(result.page_size).toBe(20);
    });

    it('should handle search params', async () => {
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

      await SystemLogAPI.getLogs({ search: 'error' });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/logs/',
        { params: { search: 'error' } }
      );
    });

    it('should handle log level filter', async () => {
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

      await SystemLogAPI.getLogs({ method_type: 'GET' });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/logs/',
        { params: { method_type: 'GET' } }
      );
    });

    it('should return logs list', async () => {
      const mockResponse = {
        content: [
          {
            uid: 'log-1',
            level: 'INFO',
            message: 'User logged in',
            timestamp: '2024-01-01T00:00:00Z',
            method_type: 'GET',
          },
          {
            uid: 'log-2',
            level: 'ERROR',
            message: 'Payment failed',
            timestamp: '2024-01-01T01:00:00Z',
            method_type: 'POST',
          },
        ],
        current_page: 1,
        page_size: 10,
        total_rows: 2,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await SystemLogAPI.getLogs();

      expect(result.content).toHaveLength(2);
      expect(result.content[0].method_type).toBe('GET');
      expect(result.content[1].method_type).toBe('POST');
    });

    it('should handle empty logs', async () => {
      const mockResponse = {
        content: [],
        current_page: 1,
        page_size: 10,
        total_rows: 0,
        total_pages: 0,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await SystemLogAPI.getLogs();

      expect(result.content).toEqual([]);
      expect(result.total_rows).toBe(0);
    });

    it('should handle date range filter', async () => {
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

      await SystemLogAPI.getLogs({
        search: '',
        status_code: '2xx',
      });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/logs/',
        {
          params: {
            search: '',
            status_code: '2xx',
          },
        }
      );
    });

    it('should handle API error for logs', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Network error'));

      await expect(SystemLogAPI.getLogs()).rejects.toThrow('Network error');
    });

    it('should handle combined filters', async () => {
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

      await SystemLogAPI.getLogs({
        search: 'payment',
        method_type: 'GET',
        page: 1,
        page_size: 25,
      });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/logs/',
        {
          params: {
            search: 'payment',
            method_type: 'GET',
            page: 1,
            page_size: 25,
          },
        }
      );
    });
  });

  describe('getManagementLog', () => {
    it('should call get endpoint for management log stats', async () => {
      const mockResponse = {
        total_errors: 111,
        percent_increase_errors: 10,
        today_errors: 15,
        percent_increase_today_errors: 5,
        avg_response_time: 250,
        percent_increase_avg_response_time: 15,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await SystemLogAPI.getManagementLog();

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/logs/management'
      );
      expect(result.total_errors).toBe(111);
      expect(result.today_errors).toBe(15);
    });

    it('should return correct management log values', async () => {
      const mockResponse = {
        total_errors: 500,
        percent_increase_errors: 25,
        today_errors: 45,
        percent_increase_today_errors: 20,
        avg_response_time: 450,
        percent_increase_avg_response_time: 30,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await SystemLogAPI.getManagementLog();

      expect(result.percent_increase_errors).toBe(25);
      expect(result.avg_response_time).toBe(450);
      expect(result.percent_increase_avg_response_time).toBe(30);
    });

    it('should handle zero errors', async () => {
      const mockResponse = {
        total_errors: 0,
        percent_increase_errors: 0,
        today_errors: 0,
        percent_increase_today_errors: 0,
        avg_response_time: 100,
        percent_increase_avg_response_time: 0,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await SystemLogAPI.getManagementLog();

      expect(result.total_errors).toBe(0);
      expect(result.today_errors).toBe(0);
    });

    it('should handle API error for management log', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Service unavailable'));

      await expect(SystemLogAPI.getManagementLog()).rejects.toThrow(
        'Service unavailable'
      );
    });

    it('should return all required fields', async () => {
      const mockResponse = {
        total_errors: 100,
        percent_increase_errors: 5,
        today_errors: 10,
        percent_increase_today_errors: 2,
        avg_response_time: 200,
        percent_increase_avg_response_time: 10,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await SystemLogAPI.getManagementLog();

      expect(result).toHaveProperty('total_errors');
      expect(result).toHaveProperty('percent_increase_errors');
      expect(result).toHaveProperty('today_errors');
      expect(result).toHaveProperty('percent_increase_today_errors');
      expect(result).toHaveProperty('avg_response_time');
      expect(result).toHaveProperty('percent_increase_avg_response_time');
    });
  });

  describe('error handling', () => {
    it('should handle 404 error', async () => {
      const error = new Error('Not found');
      (error as any).response = { status: 404 };
      mockApiClient.get.mockRejectedValue(error);

      await expect(SystemLogAPI.getLogs()).rejects.toThrow();
    });

    it('should handle 500 error', async () => {
      const error = new Error('Internal server error');
      (error as any).response = { status: 500 };
      mockApiClient.get.mockRejectedValue(error);

      await expect(SystemLogAPI.getManagementLog()).rejects.toThrow();
    });

    it('should handle 401 unauthorized', async () => {
      const error = new Error('Unauthorized');
      (error as any).response = { status: 401 };
      mockApiClient.get.mockRejectedValue(error);

      await expect(SystemLogAPI.getLogs()).rejects.toThrow();
    });

    it('should handle network timeout', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Timeout'));

      await expect(SystemLogAPI.getLogs()).rejects.toThrow('Timeout');
    });
  });
});

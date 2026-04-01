/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DashboardAPI } from './dashboard.api';

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
    getTodayOverview: vi.fn(),
    getUserInsights: vi.fn(),
    getExpenseCategories: vi.fn(),
    getCashData: vi.fn(),
    getRatings: vi.fn(),
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

describe('DashboardAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTodayOverview', () => {
    it('should call get endpoint for today overview', async () => {
      const mockResponse = {
        total_users: 150,
        new_users: 5,
        total_events: 25,
        total_expenses: 5000,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await DashboardAPI.getTodayOverview();

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/today-overview'
      );
      expect(result.total_users).toBe(150);
      expect(result.new_users).toBe(5);
    });

    it('should return correct today overview data', async () => {
      const mockResponse = {
        total_users: 500,
        new_users: 15,
        total_events: 85,
        total_expenses: 15000,
        total_money: 25000,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await DashboardAPI.getTodayOverview();

      expect(result.total_users).toBe(500);
      expect(result.total_money).toBe(25000);
    });

    it('should handle API error for today overview', async () => {
      mockApiClient.get.mockRejectedValue(new Error('API Error'));

      await expect(DashboardAPI.getTodayOverview()).rejects.toThrow('API Error');
    });

    it('should handle empty overview', async () => {
      const mockResponse = {
        total_users: 0,
        new_users: 0,
        percent_increase_new_users: 0,
        total_expenses: 0,
        total_money: 0,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await DashboardAPI.getTodayOverview();

      expect(result.total_users).toBe(0);
      expect(result.percent_increase_new_users).toBe(0);
    });
  });

  describe('getUserInsights', () => {
    it('should call get endpoint with current year', async () => {
      const currentYear = new Date().getFullYear();
      const mockResponse = [
        { month: 'January', users: 100 },
        { month: 'February', users: 120 },
      ];

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await DashboardAPI.getUserInsights();

      expect(mockApiClient.get).toHaveBeenCalledWith(
        `/admin/user-insights?year=${currentYear}`
      );
      expect(result).toHaveLength(2);
    });

    it('should return user insights for all months', async () => {
      const mockResponse = [];
      for (let i = 1; i <= 12; i++) {
        mockResponse.push({
          month: i,
          loyal_users: 100 + i * 10,
        });
      }

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await DashboardAPI.getUserInsights();

      expect(result).toHaveLength(12);
      expect(result[0].loyal_users).toBe(110);
      expect(result[11].loyal_users).toBe(220);
    });

    it('should return correct user insight structure', async () => {
      const mockResponse = [
        { month: 'Jan', loyal_users: 150, new_users: 10 },
        { month: 'Feb', loyal_users: 165, new_users: 10 },
      ];

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await DashboardAPI.getUserInsights();

      expect(result[0]).toHaveProperty('loyal_users');
      expect(result[0]).toHaveProperty('new_users');
    });

    it('should handle empty insights', async () => {
      mockApiClient.get.mockResolvedValue({ data: { data: [] } });

      const result = await DashboardAPI.getUserInsights();

      expect(result).toEqual([]);
    });

    it('should handle API error for user insights', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Network error'));

      await expect(DashboardAPI.getUserInsights()).rejects.toThrow(
        'Network error'
      );
    });
  });

  describe('getExpenseCategories', () => {
    it('should call get endpoint for expense categories', async () => {
      const mockResponse = [
        { name: 'Food', amount: 500 },
        { name: 'Transport', amount: 300 },
      ];

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await DashboardAPI.getExpenseCategories();

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/expense-categories'
      );
      expect(result).toHaveLength(2);
    });

    it('should return all expense categories', async () => {
      const mockResponse = [
        { category: 'Food', total_amount: 500, percentage: 30 },
        { category: 'Transport', total_amount: 300, percentage: 20 },
        { category: 'Entertainment', total_amount: 200, percentage: 15 },
        { category: 'Other', total_amount: 600, percentage: 35 },
      ];

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await DashboardAPI.getExpenseCategories();

      expect(result).toHaveLength(4);
      expect(result[0].category).toBe('Food');
      expect(result[3].total_amount).toBe(600);
    });

    it('should handle empty category list', async () => {
      mockApiClient.get.mockResolvedValue({ data: { data: [] } });

      const result = await DashboardAPI.getExpenseCategories();

      expect(result).toEqual([]);
    });

    it('should handle API error for expense categories', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Server error'));

      await expect(DashboardAPI.getExpenseCategories()).rejects.toThrow(
        'Server error'
      );
    });
  });

  describe('getCashData', () => {
    it('should call get endpoint for cash chart data', async () => {
      const mockResponse = [
        { date: '2024-01-01', amount: 1000 },
        { date: '2024-01-02', amount: 1500 },
      ];

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await DashboardAPI.getCashData();

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/cash-chart'
      );
      expect(result).toHaveLength(2);
    });

    it('should return cash data for multiple dates', async () => {
      const mockResponse = [];
      for (let i = 1; i <= 7; i++) {
        mockResponse.push({
          date: `2024-01-${String(i).padStart(2, '0')}`,
          deposit: 1000 * i,
          withdraw: 1000 * i * 2,
        });
      }

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await DashboardAPI.getCashData();

      expect(result).toHaveLength(7);
      expect(result[0].deposit).toBe(1000);
      expect(result[6].withdraw).toBe(14000);
    });

    it('should handle empty cash data', async () => {
      mockApiClient.get.mockResolvedValue({ data: { data: [] } });

      const result = await DashboardAPI.getCashData();

      expect(result).toEqual([]);
    });

    it('should handle API error for cash data', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Connection refused'));

      await expect(DashboardAPI.getCashData()).rejects.toThrow(
        'Connection refused'
      );
    });
  });

  describe('getRatings', () => {
    it('should call get endpoint without date filters', async () => {
      const mockResponse = [
        { rating: 5, count: 100 },
        { rating: 4, count: 50 },
      ];

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await DashboardAPI.getRatings();

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/rating',
        {
          params: {
            start: undefined,
            end: undefined,
          },
        }
      );
      expect(result).toHaveLength(2);
    });

    it('should call get endpoint with date filters', async () => {
      mockApiClient.get.mockResolvedValue({ data: { data: [] } });

      await DashboardAPI.getRatings('2024-01-01', '2024-01-31');

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/rating',
        {
          params: {
            start: '2024-01-01',
            end: '2024-01-31',
          },
        }
      );
    });

    it('should return ratings data', async () => {
      const mockResponse = [
        { rate: 5, date: 200, percentage: 40 },
        { rate: 4, date: 150, percentage: 30 },
        { rate: 3, date: 100, percentage: 20 },
        { rate: 2, date: 30, percentage: 6 },
        { rate: 1, date: 20, percentage: 4 },
      ];

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await DashboardAPI.getRatings();

      expect(result).toHaveLength(5);
      expect(result[0].rate).toBe(5);
      expect(result[0].date).toBe(200);
    });

    it('should handle only start date', async () => {
      mockApiClient.get.mockResolvedValue({ data: { data: [] } });

      await DashboardAPI.getRatings('2024-01-01');

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/rating',
        {
          params: {
            start: '2024-01-01',
            end: undefined,
          },
        }
      );
    });

    it('should handle only end date', async () => {
      mockApiClient.get.mockResolvedValue({ data: { data: [] } });

      await DashboardAPI.getRatings(undefined, '2024-01-31');

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/rating',
        {
          params: {
            start: undefined,
            end: '2024-01-31',
          },
        }
      );
    });

    it('should handle empty ratings list', async () => {
      mockApiClient.get.mockResolvedValue({ data: { data: [] } });

      const result = await DashboardAPI.getRatings('2024-01-01', '2024-01-31');

      expect(result).toEqual([]);
    });

    it('should handle API error for ratings', async () => {
      mockApiClient.get.mockRejectedValue(
        new Error('Failed to fetch ratings')
      );

      await expect(DashboardAPI.getRatings()).rejects.toThrow(
        'Failed to fetch ratings'
      );
    });
  });

  describe('error handling', () => {
    it('should handle 404 not found', async () => {
      const error = new Error('Not found');
      (error as any).response = { status: 404 };
      mockApiClient.get.mockRejectedValue(error);

      await expect(DashboardAPI.getTodayOverview()).rejects.toThrow();
    });

    it('should handle 500 server error', async () => {
      const error = new Error('Internal server error');
      (error as any).response = { status: 500 };
      mockApiClient.get.mockRejectedValue(error);

      await expect(DashboardAPI.getUserInsights()).rejects.toThrow();
    });

    it('should handle 401 unauthorized', async () => {
      const error = new Error('Unauthorized');
      (error as any).response = { status: 401 };
      mockApiClient.get.mockRejectedValue(error);

      await expect(DashboardAPI.getExpenseCategories()).rejects.toThrow();
    });

    it('should handle network timeout', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Timeout'));

      await expect(DashboardAPI.getCashData()).rejects.toThrow('Timeout');
    });
  });
});

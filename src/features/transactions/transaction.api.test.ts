/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TransactionAPI } from './transaction.api';

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
    listTransactions: vi.fn(),
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

describe('TransactionAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTransactionStats', () => {
    it('should call get endpoint for transaction stats', async () => {
      const mockResponse = {
        total_deposits: 400,
        total_withdrawals: 250,
        total_transactions: 650,
        percent_increase_transactions: 12,
        percent_increase_deposits: 8,
        percent_increase_withdrawals: 15,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await TransactionAPI.getTransactionStats();

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/transactions-management'
      );
      expect(result.total_deposits).toBe(400);
      expect(result.total_withdrawals).toBe(250);
    });

    it('should return correct transaction stats', async () => {
      const mockResponse = {
        total_deposits: 1000,
        total_withdrawals: 500,
        total_transactions: 1500,
        percent_increase_transactions: 25,
        percent_increase_deposits: 20,
        percent_increase_withdrawals: 30,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await TransactionAPI.getTransactionStats();

      expect(result.total_transactions).toBe(1500);
      expect(result.percent_increase_transactions).toBe(25);
      expect(result.percent_increase_withdrawals).toBe(30);
    });

    it('should handle zero transaction amounts', async () => {
      const mockResponse = {
        total_deposits: 0,
        total_withdrawals: 0,
        total_transactions: 0,
        percent_increase_transactions: 0,
        percent_increase_deposits: 0,
        percent_increase_withdrawals: 0,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await TransactionAPI.getTransactionStats();

      expect(result.total_deposits).toBe(0);
      expect(result.total_transactions).toBe(0);
    });

    it('should handle API error for stats', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Service unavailable'));

      await expect(TransactionAPI.getTransactionStats()).rejects.toThrow(
        'Service unavailable'
      );
    });

    it('should return all required stat fields', async () => {
      const mockResponse = {
        total_deposits: 500,
        total_withdrawals: 300,
        total_transactions: 800,
        percent_increase_transactions: 15,
        percent_increase_deposits: 10,
        percent_increase_withdrawals: 20,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await TransactionAPI.getTransactionStats();

      expect(result).toHaveProperty('total_deposits');
      expect(result).toHaveProperty('total_withdrawals');
      expect(result).toHaveProperty('total_transactions');
      expect(result).toHaveProperty('percent_increase_transactions');
      expect(result).toHaveProperty('percent_increase_deposits');
      expect(result).toHaveProperty('percent_increase_withdrawals');
    });
  });

  describe('listTransactions', () => {
    it('should call get endpoint with default pagination', async () => {
      const mockResponse = {
        content: [],
        current_page: 1,
        page_size: 10,
        total_rows: 0,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await TransactionAPI.listTransactions();

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/transactions',
        {
          params: {
            search: undefined,
            type: undefined,
            page: 1,
            page_size: 10,
          },
        }
      );
    });

    it('should handle search parameters', async () => {
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

      await TransactionAPI.listTransactions({ search: 'deposit' });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/transactions',
        expect.objectContaining({
          params: expect.objectContaining({
            search: 'deposit',
          }),
        })
      );
    });

    it('should handle type filter (deposit)', async () => {
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

      await TransactionAPI.listTransactions({ type: 'deposit' });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/transactions',
        expect.objectContaining({
          params: expect.objectContaining({
            type: 'deposit',
          }),
        })
      );
    });

    it('should handle type filter (withdrawal)', async () => {
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

      await TransactionAPI.listTransactions({ type: 'withdraw' });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/transactions',
        expect.objectContaining({ 
          params: expect.objectContaining({
            type: 'withdraw',
          }),
        })
      );
    });

    it('should handle custom pagination', async () => {
      const mockResponse = {
        content: [],
        current_page: 3,
        page_size: 25,
        total_rows: 100,
        total_pages: 4,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await TransactionAPI.listTransactions({
        page: 3,
        page_size: 25,
      });

      expect(result.current_page).toBe(3);
      expect(result.page_size).toBe(25);
      expect(result.total_pages).toBe(4);
    });

    it('should return transactions list', async () => {
      const mockResponse = {
        content: [
          {
            uid: 'tx-1',
            type: 'deposit',
            amount: 500,
            timestamp: '2024-01-01T00:00:00Z',
          },
          {
            uid: 'tx-2',
            type: 'withdrawal',
            amount: 200,
            timestamp: '2024-01-02T00:00:00Z',
          },
        ],
        current_page: 1,
        page_size: 10,
        total_rows: 2,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await TransactionAPI.listTransactions();

      expect(result.content).toHaveLength(2);
      expect(result.content[0].type).toBe('deposit');
      expect(result.content[1].type).toBe('withdrawal');
    });

    it('should handle empty transactions list', async () => {
      const mockResponse = {
        content: [],
        current_page: 1,
        page_size: 10,
        total_rows: 0,
        total_pages: 0,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await TransactionAPI.listTransactions();

      expect(result.content).toEqual([]);
      expect(result.total_rows).toBe(0);
    });

    it('should handle combined search and type filter', async () => {
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

      await TransactionAPI.listTransactions({
        search: 'user-123',
        type: 'deposit',
        page: 2,
        page_size: 20,
      });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/transactions',
        {
          params: {
            search: 'user-123',
            type: 'deposit',
            page: 2,
            page_size: 20,
          },
        }
      );
    });

    it('should handle transactions with different amounts', async () => {
      const mockResponse = {
        content: [
          {
            uid: 'tx-1',
            type: 'deposit',
            amount: 1000,
            timestamp: '2024-01-01T00:00:00Z',
          },
          {
            uid: 'tx-2',
            type: 'deposit',
            amount: 5000,
            timestamp: '2024-01-02T00:00:00Z',
          },
          {
            uid: 'tx-3',
            type: 'withdrawal',
            amount: 2000,
            timestamp: '2024-01-03T00:00:00Z',
          },
        ],
        current_page: 1,
        page_size: 10,
        total_rows: 3,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await TransactionAPI.listTransactions();

      expect(result.content).toHaveLength(3);
      expect(result.content[0].amount).toBe(1000);
      expect(result.content[1].amount).toBe(5000);
      expect(result.content[2].amount).toBe(2000);
    });

    it('should handle API error for list', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Network error'));

      await expect(TransactionAPI.listTransactions()).rejects.toThrow(
        'Network error'
      );
    });
  });

  describe('error handling', () => {
    it('should handle 404 error', async () => {
      const error = new Error('Not found');
      (error as any).response = { status: 404 };
      mockApiClient.get.mockRejectedValue(error);

      await expect(TransactionAPI.listTransactions()).rejects.toThrow();
    });

    it('should handle 500 error', async () => {
      const error = new Error('Internal server error');
      (error as any).response = { status: 500 };
      mockApiClient.get.mockRejectedValue(error);

      await expect(TransactionAPI.getTransactionStats()).rejects.toThrow();
    });

    it('should handle 401 unauthorized', async () => {
      const error = new Error('Unauthorized');
      (error as any).response = { status: 401 };
      mockApiClient.get.mockRejectedValue(error);

      await expect(TransactionAPI.listTransactions()).rejects.toThrow();
    });

    it('should handle network timeout', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Timeout'));

      await expect(TransactionAPI.getTransactionStats()).rejects.toThrow(
        'Timeout'
      );
    });
  });
});

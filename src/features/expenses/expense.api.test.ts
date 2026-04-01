/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExpenseAPI } from './expense.api';

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
    listExpenses: vi.fn(),
    deActivateExpense: vi.fn(),
    getExpenseDetail: vi.fn(),
    getExpenseAttachments: vi.fn(),
  },
  USE_MOCK: false,
}));

import { api as apiClient } from '../../config/api.config';

const mockApiClient = apiClient as unknown as {
  get: ReturnType<typeof vi.fn>;
  patch: ReturnType<typeof vi.fn>;
};

describe('ExpenseAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getExpenseStatistics', () => {
    it('should call get endpoint for expense statistics', async () => {
      const mockResponse = {
        total_expenses: 100,
        total_avg_amount: 1000,
        active_expenses: 80,
        total_expired_expenses: 20,
        percent_increase_expenses: 10,
        percent_increase_avg_amount: 5,
        percent_increase_active_expenses: 15,
        percent_increase_expired_expenses: -5,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await ExpenseAPI.getExpenseStatistics();

      expect(mockApiClient.get).toHaveBeenCalledWith('/admin/expense-management');
      expect(result.total_expenses).toBe(100);
    });

    it('should return statistics with all fields', async () => {
      const mockResponse = {
        total_expenses: 50,
        total_avg_amount: 500,
        active_expenses: 40,
        total_expired_expenses: 10,
        percent_increase_expenses: 5,
        percent_increase_avg_amount: 10,
        percent_increase_active_expenses: 8,
        percent_increase_expired_expenses: 2,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await ExpenseAPI.getExpenseStatistics();

      expect(result.total_expenses).toBe(50);
      expect(result.total_avg_amount).toBe(500);
      expect(result.active_expenses).toBe(40);
      expect(result.total_expired_expenses).toBe(10);
    });

    it('should handle negative percent changes', async () => {
      const mockResponse = {
        total_expenses: 100,
        total_avg_amount: 1000,
        active_expenses: 80,
        total_expired_expenses: 20,
        percent_increase_expenses: -5,
        percent_increase_avg_amount: -2,
        percent_increase_active_expenses: -10,
        percent_increase_expired_expenses: 5,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await ExpenseAPI.getExpenseStatistics();

      expect(result.percent_increase_expenses).toBe(-5);
      expect(result.percent_increase_avg_amount).toBe(-2);
    });
  });

  describe('getExpenses', () => {
    it('should call get endpoint with default pagination', async () => {
      const mockResponse = {
        content: [],
        total_rows: 0,
        current_page: 1,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await ExpenseAPI.getExpenses();

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/expenses',
        {
          params: {
            page: 1,
            page_size: 10,
          },
        }
      );
    });

    it('should handle custom pagination', async () => {
      const mockResponse = { content: [], total_rows: 0, current_page: 2, total_pages: 2 };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await ExpenseAPI.getExpenses({ page: 2, page_size: 20 });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/expenses',
        {
          params: {
            page: 2,
            page_size: 20,
          },
        }
      );
    });

    it('should return expenses list', async () => {
      const mockResponse = {
        content: [
          { uid: '1', description: 'Lunch', amount: 15 },
          { uid: '2', description: 'Movie', amount: 12 },
        ],
        total_rows: 2,
        current_page: 1,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await ExpenseAPI.getExpenses();

      expect(result.content).toHaveLength(2);
      expect(result.total_rows).toBe(2);
    });

    it('should handle empty expenses list', async () => {
      const mockResponse = { content: [], total_rows: 0, current_page: 1, total_pages: 0 };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await ExpenseAPI.getExpenses();

      expect(result.content).toEqual([]);
    });
  });

  describe('deactivateExpense', () => {
    it('should call patch endpoint to deactivate expense', async () => {
      mockApiClient.patch.mockResolvedValue({ data: {} });

      await ExpenseAPI.deactivateExpense('expense-123');

      expect(mockApiClient.patch).toHaveBeenCalledWith(
        '/admin/expense/deactivate/expense-123'
      );
    });

    it('should handle different expense uids', async () => {
      mockApiClient.patch.mockResolvedValue({ data: {} });

      await ExpenseAPI.deactivateExpense('another-expense-id');

      expect(mockApiClient.patch).toHaveBeenCalledWith(
        '/admin/expense/deactivate/another-expense-id'
      );
    });

    it('should return void on success', async () => {
      mockApiClient.patch.mockResolvedValue({ data: {} });

      const result = await ExpenseAPI.deactivateExpense('expense-123');

      expect(result).toBeUndefined();
    });

    it('should throw error on deactivation failure', async () => {
      mockApiClient.patch.mockRejectedValue(new Error('Deactivation failed'));

      await expect(ExpenseAPI.deactivateExpense('expense-123')).rejects.toThrow('Deactivation failed');
    });
  });

  describe('activateExpense', () => {
    it('should call patch endpoint to activate expense', async () => {
      mockApiClient.patch.mockResolvedValue({ data: {} });

      await ExpenseAPI.activateExpense('expense-123');

      expect(mockApiClient.patch).toHaveBeenCalledWith(
        '/admin/expense/active/expense-123'
      );
    });

    it('should handle different expense uids', async () => {
      mockApiClient.patch.mockResolvedValue({ data: {} });

      await ExpenseAPI.activateExpense('new-expense-id');

      expect(mockApiClient.patch).toHaveBeenCalledWith(
        '/admin/expense/active/new-expense-id'
      );
    });

    it('should return void on success', async () => {
      mockApiClient.patch.mockResolvedValue({ data: {} });

      const result = await ExpenseAPI.activateExpense('expense-123');

      expect(result).toBeUndefined();
    });

    it('should throw error on activation failure', async () => {
      mockApiClient.patch.mockRejectedValue(new Error('Activation failed'));

      await expect(ExpenseAPI.activateExpense('expense-123')).rejects.toThrow('Activation failed');
    });
  });

  describe('getSplitExpense', () => {
    it('should call get endpoint with expense uid', async () => {
      const mockResponse = {
        uid: 'exp-123',
        description: 'Lunch',
        amount: 50,
        splits: [],
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await ExpenseAPI.getSplitExpense('exp-123');

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/expenses/exp-123'
      );
    });

    it('should return split expense details', async () => {
      const mockResponse = {
        uid: 'exp-456',
        description: 'Dinner',
        amount: 100,
        split_type: 'EQUAL',
        list_user_shares: [
          { uid: 'split-1', user_id: 'user-1', amount: 50 },
          { uid: 'split-2', user_id: 'user-2', amount: 50 },
        ],
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await ExpenseAPI.getSplitExpense('exp-456');

      expect(result.split_type).toBe('EQUAL');
      expect(result.list_user_shares).toHaveLength(2);
    });

    it('should handle different expense uids', async () => {
      const mockResponse = { uid: 'custom-exp', description: 'Movie', amount: 20, split_type: 'EQUAL', list_user_shares: [] };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await ExpenseAPI.getSplitExpense('custom-exp');

      expect(mockApiClient.get).toHaveBeenCalledWith('/admin/expenses/custom-exp');
    });

    it('should throw error if expense not found', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Expense not found'));

      await expect(ExpenseAPI.getSplitExpense('nonexistent')).rejects.toThrow('Expense not found');
    });
  });

  describe('getExpenseAttachments', () => {
    it('should call get endpoint with default pagination', async () => {
      const mockResponse = {
        content: [],
        total_rows: 0,
        current_page: 1,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await ExpenseAPI.getExpenseAttachments('expense-123');

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/expense/expense-123/attachments',
        {
          params: {
            page: 1,
            page_size: 10,
          },
        }
      );
    });

    it('should handle custom pagination', async () => {
      const mockResponse = { content: [], total_rows: 0, current_page: 2, total_pages: 2 };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await ExpenseAPI.getExpenseAttachments('expense-123', { page: 2, page_size: 20 });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/expense/expense-123/attachments',
        {
          params: {
            page: 2,
            page_size: 20,
          },
        }
      );
    });

    it('should return attachments list', async () => {
      const mockResponse = {
        content: [
          { id: '1', file_name: 'receipt.pdf', file_url: 'https://example.com/receipt.pdf' },
          { id: '2', file_name: 'invoice.pdf', file_url: 'https://example.com/invoice.pdf' },
        ],
        total_rows: 2,
        current_page: 1,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await ExpenseAPI.getExpenseAttachments('expense-123');

      expect(result.content).toHaveLength(2);
    });

    it('should handle empty attachments', async () => {
      const mockResponse = { content: [], total_rows: 0, current_page: 1, total_pages: 0 };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await ExpenseAPI.getExpenseAttachments('expense-456');

      expect(result.content).toEqual([]);
    });

    it('should throw error if expense not found', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Expense not found'));

      await expect(ExpenseAPI.getExpenseAttachments('nonexistent')).rejects.toThrow('Expense not found');
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Network error'));

      await expect(ExpenseAPI.getExpenses()).rejects.toThrow('Network error');
    });

    it('should handle API 500 errors', async () => {
      const error = new Error('Server error');
      (error as any).response = { status: 500 };
      mockApiClient.get.mockRejectedValue(error);

      await expect(ExpenseAPI.getExpenses()).rejects.toThrow('Server error');
    });

    it('should handle 401 unauthorized', async () => {
      const error = new Error('Unauthorized');
      (error as any).response = { status: 401 };
      mockApiClient.patch.mockRejectedValue(error);

      await expect(ExpenseAPI.deactivateExpense('exp-123')).rejects.toThrow('Unauthorized');
    });
  });
});

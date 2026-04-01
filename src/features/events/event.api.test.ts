/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventAPI } from './event.api';

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
    listEvents: vi.fn(),
    listEventMembers: vi.fn(),
    updateEvent: vi.fn(),
    listEventExpenses: vi.fn(),
  },
  USE_MOCK: false,
}));

import { api as apiClient } from '../../config/api.config';

const mockApiClient = apiClient as unknown as {
  get: ReturnType<typeof vi.fn>;
  patch: ReturnType<typeof vi.fn>;
};

describe('EventAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getEventStatistics', () => {
    it('should call get endpoint for event statistics', async () => {
      const mockResponse = {
        total_events: 12,
        total_members: 150,
        active_events: 8,
        total_finished_events: 4,
        percent_increase_events: 10,
        percent_increase_members: 5,
        percent_increase_active_events: 15,
        percent_increase_finished_events: -5,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await EventAPI.getEventStatistics();

      expect(mockApiClient.get).toHaveBeenCalledWith('/admin/event-management');
      expect(result.total_events).toBe(12);
    });

    it('should return statistics with all fields', async () => {
      const mockResponse = {
        total_events: 20,
        total_members: 250,
        active_events: 15,
        total_finished_events: 5,
        percent_increase_events: 15,
        percent_increase_members: 10,
        percent_increase_active_events: 20,
        percent_increase_finished_events: 0,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await EventAPI.getEventStatistics();

      expect(result.total_events).toBe(20);
      expect(result.total_members).toBe(250);
      expect(result.active_events).toBe(15);
    });

    it('should handle negative percent changes', async () => {
      const mockResponse = {
        total_events: 10,
        total_members: 100,
        active_events: 7,
        total_finished_events: 3,
        percent_increase_events: -5,
        percent_increase_members: -10,
        percent_increase_active_events: -3,
        percent_increase_finished_events: 5,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await EventAPI.getEventStatistics();

      expect(result.percent_increase_events).toBe(-5);
    });
  });

  describe('getEvents', () => {
    it('should call get endpoint with default parameters', async () => {
      const mockResponse = {
        content: [],
        total_rows: 0,
        current_page: 1,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await EventAPI.getEvents();

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/events',
        {
          params: {
            search: null,
            type: null,
            page: 1,
            page_size: 10,
          },
        }
      );
    });

    it('should handle search parameter', async () => {
      const mockResponse = { content: [], total_rows: 0, current_page: 1, total_pages: 1 };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await EventAPI.getEvents({ search: 'vacation' });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/events',
        expect.objectContaining({
          params: expect.objectContaining({
            search: 'vacation',
          }),
        })
      );
    });

    it('should handle type filter parameter', async () => {
      const mockResponse = { content: [], total_rows: 0, current_page: 1, total_pages: 1 };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await EventAPI.getEvents({ type: 'active' });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/events',
        expect.objectContaining({
          params: expect.objectContaining({
            type: 'active',
          }),
        })
      );
    });

    it('should handle pagination parameters', async () => {
      const mockResponse = { content: [], total_rows: 0, current_page: 2, total_pages: 2 };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await EventAPI.getEvents({ page: 2, page_size: 15 });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/events',
        expect.objectContaining({
          params: expect.objectContaining({
            page: 2,
            page_size: 15,
          }),
        })
      );
    });

    it('should return events list', async () => {
      const mockResponse = {
        content: [
          { uid: '1', event_name: 'Birthday', status: 'active' },
          { uid: '2', event_name: 'Vacation', status: 'finished' },
        ],
        total_rows: 2,
        current_page: 1,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await EventAPI.getEvents();

      expect(result.content).toHaveLength(2);
    });
  });

  describe('getEventMembers', () => {
    it('should call get endpoint with event uid', async () => {
      const mockResponse = {
        content: [],
        total_rows: 0,
        current_page: 1,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await EventAPI.getEventMembers({ event_uid: 'event-123' });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/event/event-123/event-members',
        {
          params: {
            search: null,
            page: 1,
            page_size: 10,
          },
        }
      );
    });

    it('should handle search and pagination', async () => {
      const mockResponse = { content: [], total_rows: 0, current_page: 1, total_pages: 1 };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await EventAPI.getEventMembers({ event_uid: 'event-123', search: 'john', page: 2, page_size: 20 });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/event/event-123/event-members',
        expect.objectContaining({
          params: expect.objectContaining({
            search: 'john',
            page: 2,
            page_size: 20,
          }),
        })
      );
    });

    it('should return members list', async () => {
      const mockResponse = {
        content: [
          { uid: '1', full_name: 'User 1' },
          { uid: '2', full_name: 'User 2' },
        ],
        total_rows: 2,
        current_page: 1,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await EventAPI.getEventMembers({ event_uid: 'event-123' });

      expect(result.content).toHaveLength(2);
    });
  });

  describe('getEventsInGroup', () => {
    it('should call get endpoint with group uid', async () => {
      const mockResponse = {
        content: [],
        total_rows: 0,
        current_page: 1,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await EventAPI.getEventsInGroup({ group_uid: 'group-123' });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/events',
        {
          params: {
            search: null,
            type: null,
            page: 1,
            page_size: 10,
            group_uid: 'group-123',
          },
        }
      );
    });

    it('should handle search and type filters', async () => {
      const mockResponse = { content: [], total_rows: 0, current_page: 1, total_pages: 1 };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await EventAPI.getEventsInGroup({ group_uid: 'group-123', search: 'party', type: 'active' });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/admin/events',
        expect.objectContaining({
          params: expect.objectContaining({
            search: 'party',
            type: 'active',
            group_uid: 'group-123',
          }),
        })
      );
    });

    it('should return events in group', async () => {
      const mockResponse = {
        content: [
          { uid: '1', event_name: 'Event 1' },
        ],
        total_rows: 1,
        current_page: 1,
        total_pages: 1,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await EventAPI.getEventsInGroup({ group_uid: 'group-123' });

      expect(result.content).toHaveLength(1);
    });
  });

  describe('deactivateEvent', () => {
    it('should call patch endpoint to deactivate event', async () => {
      mockApiClient.patch.mockResolvedValue({ data: {} });

      await EventAPI.deactivateEvent('event-123');

      expect(mockApiClient.patch).toHaveBeenCalledWith('/admin/event/event-123');
    });

    it('should handle different event uids', async () => {
      mockApiClient.patch.mockResolvedValue({ data: {} });

      await EventAPI.deactivateEvent('another-event');

      expect(mockApiClient.patch).toHaveBeenCalledWith('/admin/event/another-event');
    });

    it('should return void on success', async () => {
      mockApiClient.patch.mockResolvedValue({ data: {} });

      const result = await EventAPI.deactivateEvent('event-123');

      expect(result).toBeUndefined();
    });

    it('should throw error on deactivation failure', async () => {
      mockApiClient.patch.mockRejectedValue(new Error('Deactivation failed'));

      await expect(EventAPI.deactivateEvent('event-123')).rejects.toThrow('Deactivation failed');
    });
  });

  describe('activateEvent', () => {
    it('should call patch endpoint to activate event', async () => {
      mockApiClient.patch.mockResolvedValue({ data: {} });

      await EventAPI.activateEvent('event-123');

      expect(mockApiClient.patch).toHaveBeenCalledWith('/admin/event/active/event-123');
    });

    it('should handle different event uids', async () => {
      mockApiClient.patch.mockResolvedValue({ data: {} });

      await EventAPI.activateEvent('new-event');

      expect(mockApiClient.patch).toHaveBeenCalledWith('/admin/event/active/new-event');
    });

    it('should return void on success', async () => {
      mockApiClient.patch.mockResolvedValue({ data: {} });

      const result = await EventAPI.activateEvent('event-123');

      expect(result).toBeUndefined();
    });

    it('should throw error on activation failure', async () => {
      mockApiClient.patch.mockRejectedValue(new Error('Activation failed'));

      await expect(EventAPI.activateEvent('event-123')).rejects.toThrow('Activation failed');
    });
  });

  describe('getExpensesInEvent', () => {
    it('should call get endpoint with event uid', async () => {
      const mockResponse = {
        content: [],
        total_rows: 0,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      await EventAPI.getExpensesInEvent('event-123');

      expect(mockApiClient.get).toHaveBeenCalledWith('/admin/expense/event-123');
    });

    it('should return expenses list', async () => {
      const mockResponse = {
        expenses: [
          { eid: '1', description: 'Lunch', amount: 50 },
          { eid: '2', description: 'Transport', amount: 30 },
        ],
        total_rows: 2,
      };

      mockApiClient.get.mockResolvedValue({ data: { data: mockResponse } });

      const result = await EventAPI.getExpensesInEvent('event-123');

      expect(result.expenses).toHaveLength(2);
    });

    it('should throw error if event not found', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Event not found'));

      await expect(EventAPI.getExpensesInEvent('nonexistent')).rejects.toThrow('Event not found');
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Network error'));

      await expect(EventAPI.getEvents()).rejects.toThrow('Network error');
    });

    it('should handle API 500 errors', async () => {
      const error = new Error('Server error');
      (error as any).response = { status: 500 };
      mockApiClient.get.mockRejectedValue(error);

      await expect(EventAPI.getEvents()).rejects.toThrow('Server error');
    });

    it('should handle 401 unauthorized', async () => {
      const error = new Error('Unauthorized');
      (error as any).response = { status: 401 };
      mockApiClient.patch.mockRejectedValue(error);

      await expect(EventAPI.deactivateEvent('event-123')).rejects.toThrow('Unauthorized');
    });

    it('should handle 404 not found', async () => {
      const error = new Error('Not found');
      (error as any).response = { status: 404 };
      mockApiClient.get.mockRejectedValue(error);

      await expect(EventAPI.getExpensesInEvent('nonexistent')).rejects.toThrow('Not found');
    });
  });
});

/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest';
import { mockApi, USE_MOCK } from './mockApi';

describe('mockApi', () => {
  // ===== USERS TESTS =====
  describe('listUsers', () => {
    it('should list users with default pagination', async () => {
      const result = await mockApi.listUsers();
      expect(result.content).toBeDefined();
      expect(result.current_page).toBe(1);
      expect(result.page_size).toBe(10);
      expect(result.total_rows).toBeGreaterThan(0);
      expect(result.total_pages).toBeGreaterThan(0);
    });

    it('should filter users by search', async () => {
      const result = await mockApi.listUsers({ search: 'john' });
      expect(result.content).toBeDefined();
      expect(Array.isArray(result.content)).toBe(true);
    });

    it('should handle custom pagination', async () => {
      const result = await mockApi.listUsers({ page: 2, page_size: 5 });
      expect(result.current_page).toBe(2);
      expect(result.page_size).toBe(5);
    });

    it('should return paginated results correctly', async () => {
      const result = await mockApi.listUsers({ page: 1, page_size: 3 });
      expect(result.content.length).toBeLessThanOrEqual(3);
    });
  });

  describe('searchUsers', () => {
    it('should search users', async () => {
      const result = await mockApi.searchUsers({ search: 'john' });
      expect(result.content).toBeDefined();
      expect(result.current_page).toBe(1);
    });

    it('should return active status for users', async () => {
      const result = await mockApi.searchUsers({ search: 'a' });
      if (result.content.length > 0) {
        expect(result.content[0].status).toMatch(/^(active|inactive)$/);
      }
    });
  });

  describe('getUserDetail', () => {
    it('should get user detail', async () => {
      const listResult = await mockApi.listUsers({ page_size: 1 });
      if (listResult.content.length > 0) {
        const userUid = listResult.content[0].uid;
        const detail = await mockApi.getUserDetail(userUid);
        expect(detail.uid).toBe(userUid);
        expect(detail.email).toBeDefined();
        expect(detail.full_name).toBeDefined();
      }
    });

    it('should throw error for non-existent user', async () => {
      await expect(mockApi.getUserDetail('invalid-uid')).rejects.toThrow('User not found');
    });
  });

  describe('activateUser', () => {
    it('should activate user', async () => {
      const listResult = await mockApi.listUsers({ page_size: 1 });
      if (listResult.content.length > 0) {
        const result = await mockApi.activateUser(listResult.content[0].uid);
        expect(result).toBe(true);
      }
    });
  });

  describe('deActivateUser', () => {
    it('should deactivate user', async () => {
      const listResult = await mockApi.listUsers({ page_size: 1 });
      if (listResult.content.length > 0) {
        const result = await mockApi.deActivateUser(listResult.content[0].uid);
        expect(result).toBe(true);
      }
    });
  });

  describe('listUserGroups', () => {
    it('should list user groups', async () => {
      const listResult = await mockApi.listUsers({ page_size: 1 });
      if (listResult.content.length > 0) {
        const userUid = listResult.content[0].uid;
        const result = await mockApi.listUserGroups(userUid);
        expect(result.content).toBeDefined();
        expect(result.current_page).toBe(1);
      }
    });
  });

  describe('listUserExpenses', () => {
    it('should list user expenses', async () => {
      const listResult = await mockApi.listUsers({ page_size: 1 });
      if (listResult.content.length > 0) {
        const result = await mockApi.listUserExpenses(listResult.content[0].uid);
        expect(result.content).toBeDefined();
        expect(Array.isArray(result.content)).toBe(true);
      }
    });
  });

  describe('getUserLoginHistory', () => {
    it('should get user login history', async () => {
      const listResult = await mockApi.listUsers({ page_size: 1 });
      if (listResult.content.length > 0) {
        const result = await mockApi.getUserLoginHistory(listResult.content[0].uid);
        expect(result.content).toBeDefined();
        expect(result.total_rows).toBeGreaterThan(0);
      }
    });
  });

  // ===== ADMINS TESTS =====
  describe('listAdmins', () => {
    it('should list admins', async () => {
      const result = await mockApi.listAdmins();
      expect(result.content).toBeDefined();
      expect(result.current_page).toBe(1);
      expect(result.page_size).toBe(10);
    });

    it('should filter admins by search', async () => {
      const result = await mockApi.listAdmins({ search: 'admin' });
      expect(result.content).toBeDefined();
    });

    it('should handle custom pagination', async () => {
      const result = await mockApi.listAdmins({ page: 2, page_size: 5 });
      expect(result.current_page).toBe(2);
      expect(result.page_size).toBe(5);
    });
  });

  describe('createAdmin', () => {
    it('should create new admin', async () => {
      const result = await mockApi.createAdmin({ email: 'newadmin@test.com' });
      expect(result.uid).toBeDefined();
      expect(result.email).toBe('newadmin@test.com');
      expect(result.status).toBe('active');
      expect(result.created_at).toBeDefined();
    });
  });

  describe('deleteAdmin', () => {
    it('should delete admin', async () => {
      const created = await mockApi.createAdmin({ email: 'deltest@test.com' });
      const result = await mockApi.deleteAdmin(created.uid);
      expect(result).toBe(true);
    });
  });

  describe('deActivateAdmin', () => {
    it('should deactivate admin', async () => {
      const listResult = await mockApi.listAdmins({ page_size: 1 });
      if (listResult.content.length > 0) {
        const result = await mockApi.deActivateAdmin(listResult.content[0].uid);
        expect(result).toBe(true);
      }
    });
  });

  // ===== DASHBOARD TESTS =====
  describe('getTodayOverview', () => {
    it('should get today overview', async () => {
      const result = await mockApi.getTodayOverview();
      expect(result).toBeDefined();
    });
  });

  describe('getUserInsights', () => {
    it('should get user insights', async () => {
      const result = await mockApi.getUserInsights();
      expect(result).toBeDefined();
    });
  });

  describe('getExpenseCategories', () => {
    it('should get expense categories', async () => {
      const result = await mockApi.getExpenseCategories();
      expect(result).toBeDefined();
    });
  });

  describe('getCashData', () => {
    it('should get cash data', async () => {
      const result = await mockApi.getCashData();
      expect(result).toBeDefined();
    });
  });

  describe('getRatings', () => {
    it('should get ratings', async () => {
      const result = await mockApi.getRatings();
      expect(result).toBeDefined();
    });
  });

  // ===== GROUPS TESTS =====
  describe('listGroups', () => {
    it('should list groups', async () => {
      const result = await mockApi.listGroups();
      expect(result.content).toBeDefined();
      expect(result.current_page).toBe(1);
    });

    it('should search groups', async () => {
      const result = await mockApi.listGroups({ search: 'test' });
      expect(result.content).toBeDefined();
    });

    it('should handle custom pagination', async () => {
      const result = await mockApi.listGroups({ page: 2, page_size: 5 });
      expect(result.current_page).toBe(2);
    });
  });

  describe('getGroupDetail', () => {
    it('should get group detail', async () => {
      const listResult = await mockApi.listGroups({ page_size: 1 });
      if (listResult.content.length > 0) {
        const groupUid = listResult.content[0].uid;
        const result = await mockApi.getGroupDetail(groupUid);
        expect(result.uid).toBe(groupUid);
      }
    });

    it('should throw error for non-existent group', async () => {
      await expect(mockApi.getGroupDetail('invalid-uid')).rejects.toThrow('Group not found');
    });
  });

  describe('listGroupMembers', () => {
    it('should list group members', async () => {
      const listResult = await mockApi.listGroups({ page_size: 1 });
      if (listResult.content.length > 0) {
        const result = await mockApi.listGroupMembers(listResult.content[0].uid);
        expect(result.content).toBeDefined();
        expect(result.current_page).toBe(1);
      }
    });
  });

  describe('updateGroup', () => {
    it('should update group', async () => {
      const listResult = await mockApi.listGroups({ page_size: 1 });
      if (listResult.content.length > 0) {
        const groupUid = listResult.content[0].uid;
        const result = await mockApi.updateGroup(groupUid, { name: 'Updated Group' });
        expect(result.uid).toBe(groupUid);
      }
    });
  });

  // ===== EVENTS TESTS =====
  describe('listEvents', () => {
    it('should list events', async () => {
      const result = await mockApi.listEvents();
      expect(result.content).toBeDefined();
      expect(result.current_page).toBe(1);
    });

    it('should search events', async () => {
      const result = await mockApi.listEvents({ search: 'party' });
      expect(result.content).toBeDefined();
    });
  });

  describe('getEventDetail', () => {
    it('should get event detail', async () => {
      const listResult = await mockApi.listEvents({ page_size: 1 });
      if (listResult.content.length > 0) {
        const eventUid = listResult.content[0].event_uid;
        const result = await mockApi.getEventDetail(eventUid);
        expect(result.event_uid).toBe(eventUid);
      }
    });

    it('should throw error for non-existent event', async () => {
      await expect(mockApi.getEventDetail('invalid-uid')).rejects.toThrow('Event not found');
    });
  });

  describe('listEventMembers', () => {
    it('should list event members', async () => {
      const listResult = await mockApi.listEvents({ page_size: 1 });
      if (listResult.content.length > 0) {
        const result = await mockApi.listEventMembers(listResult.content[0].event_uid);
        expect(result.content).toBeDefined();
      }
    });
  });

  describe('listEventExpenses', () => {
    it('should list event expenses', async () => {
      const listResult = await mockApi.listEvents({ page_size: 1 });
      if (listResult.content.length > 0) {
        const result = await mockApi.listEventExpenses(listResult.content[0].event_uid);
        expect(result.expenses).toBeDefined();
        expect(result.total_amount).toBeDefined();
      }
    });
  });

  describe('updateEvent', () => {
    it('should update event', async () => {
      const listResult = await mockApi.listEvents({ page_size: 1 });
      if (listResult.content.length > 0) {
        const eventUid = listResult.content[0].event_uid;
        const result = await mockApi.updateEvent(eventUid, { event_name: 'Updated Event' });
        expect(result.event_uid).toBe(eventUid);
      }
    });
  });

  // ===== EXPENSES TESTS =====
  describe('listExpenses', () => {
    it('should list expenses', async () => {
      const result = await mockApi.listExpenses();
      expect(result.content).toBeDefined();
      expect(result.current_page).toBe(1);
    });

    it('should search expenses', async () => {
      const result = await mockApi.listExpenses({ search: 'food' });
      expect(result.content).toBeDefined();
    });

    it('should handle custom pagination', async () => {
      const result = await mockApi.listExpenses({ page: 2, page_size: 5 });
      expect(result.current_page).toBe(2);
    });
  });

  describe('getExpenseDetail', () => {
    it('should get expense detail', async () => {
      const listResult = await mockApi.listExpenses({ page_size: 1 });
      if (listResult.content.length > 0) {
        const expenseUid = listResult.content[0].expense_uid || listResult.content[0].uid;
        const result = await mockApi.getExpenseDetail(expenseUid);
        expect(result).toBeDefined();
      }
    });

    it('should throw error for non-existent expense', async () => {
      await expect(mockApi.getExpenseDetail('invalid-uid')).rejects.toThrow('Expense not found');
    });
  });

  describe('getExpenseAttachments', () => {
    it('should get expense attachments', async () => {
      const result = await mockApi.getExpenseAttachments();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('deActivateExpense', () => {
    it('should deactivate expense', async () => {
      const listResult = await mockApi.listExpenses({ page_size: 1 });
      if (listResult.content.length > 0) {
        const result = await mockApi.deActivateExpense(listResult.content[0].expense_uid || listResult.content[0].uid);
        expect(result).toBe(true);
      }
    });
  });

  // ===== TRANSACTIONS TESTS =====
  describe('listTransactions', () => {
    it('should list transactions', async () => {
      const result = await mockApi.listTransactions();
      expect(result.content).toBeDefined();
      expect(result.current_page).toBe(1);
    });

    it('should handle custom pagination', async () => {
      const result = await mockApi.listTransactions({ page: 2, page_size: 5 });
      expect(result.current_page).toBe(2);
    });
  });

  // ===== NOTIFICATIONS TESTS =====
  describe('getNotificationStats', () => {
    it('should get notification stats', async () => {
      const result = await mockApi.getNotificationStats();
      expect(result.total_notifications).toBeDefined();
      expect(result.total_users).toBeDefined();
      expect(result.notifications_today).toBeDefined();
    });
  });

  describe('listNotifications', () => {
    it('should list notifications', async () => {
      const result = await mockApi.listNotifications();
      expect(result.content).toBeDefined();
      expect(result.current_page).toBe(1);
    });

    it('should search notifications', async () => {
      const result = await mockApi.listNotifications({ search: 'test' });
      expect(result.content).toBeDefined();
    });

    it('should filter notifications by type', async () => {
      const result = await mockApi.listNotifications({ type: 'info' });
      expect(result.content).toBeDefined();
    });
  });

  describe('createNotification', () => {
    it('should create notification', async () => {
      const result = await mockApi.createNotification({
        content: 'Test notification',
        type: 'System',
        to_user_uids: [],
        is_broadcast: false,
      });
      expect(result.uid).toBeDefined();
      expect(result.content).toBe('Test notification');
      expect(result.type).toBe('System');
    });
  });

  describe('deleteNotification', () => {
    it('should delete notification', async () => {
      const created = await mockApi.createNotification({
        content: 'Delete test',
        type: 'System',
        to_user_uids: [],
        is_broadcast: false,
      });
      const result = await mockApi.deleteNotification(created.uid);
      expect(result).toBe(true);
    });
  });

  // ===== MESSAGES TESTS =====
  describe('getMessageGroups', () => {
    it('should get message groups', async () => {
      const result = await mockApi.getMessageGroups();
      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        expect(result[0].uid).toBeDefined();
        expect(result[0].group_name).toBeDefined();
        expect(result[0].total_messages).toBeDefined();
      }
    });
  });

  describe('listMessages', () => {
    it('should list messages', async () => {
      const groups = await mockApi.getMessageGroups();
      if (groups.length > 0) {
        const result = await mockApi.listMessages(groups[0].uid);
        expect(result.content).toBeDefined();
        expect(result.current_page).toBe(1);
      }
    });

    it('should search messages', async () => {
      const groups = await mockApi.getMessageGroups();
      if (groups.length > 0) {
        const result = await mockApi.listMessages(groups[0].uid, { search: 'test' });
        expect(result.content).toBeDefined();
      }
    });
  });

  // ===== SYSTEM LOGS TESTS =====
  describe('listSystemLogs', () => {
    it('should list system logs', async () => {
      const result = await mockApi.listSystemLogs();
      expect(result.content).toBeDefined();
      expect(result.current_page).toBe(1);
      expect(result.total_rows).toBeGreaterThan(0);
    });

    it('should handle custom pagination', async () => {
      const result = await mockApi.listSystemLogs({ page: 2, page_size: 5 });
      expect(result.current_page).toBe(2);
    });
  });

  // ===== AUTH TESTS =====
  describe('login', () => {
    it('should login with valid credentials', async () => {
      const result = await mockApi.login('test@example.com', 'password123');
      expect(result.access_token).toBeDefined();
      expect(result.refresh_token).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw error with invalid credentials', async () => {
      await expect(mockApi.login('', 'password')).rejects.toThrow('Invalid credentials');
    });

    it('should throw error without password', async () => {
      await expect(mockApi.login('test@example.com', '')).rejects.toThrow('Invalid credentials');
    });
  });

  // ===== MOCK FLAG TEST =====
  describe('USE_MOCK flag', () => {
    it('should have USE_MOCK flag', () => {
      expect(typeof USE_MOCK).toBe('boolean');
    });
  });
});

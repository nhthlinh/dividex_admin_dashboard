/**
 * CENTRALIZED MOCK API LAYER
 * 
 * This module provides mock data for development/testing purposes.
 * Toggle USE_MOCK flag to switch between mock and real APIs.
 * 
 * When USE_MOCK = true:  All API calls return mock data with simulated delays
 * When USE_MOCK = false: API modules use original axios calls (fallback)
 */

import type { GetGroupMembersParams, GroupItem } from "../features/groups/group.types";
import type { EventItem } from "../features/events/event.types";
import type { CreateNotificationPayload } from "../features/notifications/notification.types";
import type { ExpenseSimpleListResponse } from "../features/events/event.types";
import type { CurrencyType, SplitType, ExpenseStatus } from "../features/expenses/expense.types";
import type { MessageStatus } from "../features/messages/messages.types";
import type { HttpMethod } from "../features/systemLogs/systemLog.types";

// ====== CONFIGURATION ======
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || false; // Toggle via env var or default to false
const MOCK_DELAY_MS = 400; // Simulate network delay

// ====== HELPER FUNCTIONS ======

/**
 * Simulate a network delay
 */
const delay = (ms: number = MOCK_DELAY_MS): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generate a unique ID
 */
const generateUid = (): string => {
  return `uid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generate random integer between min and max
 */
const randomBetween = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Format date to ISO string
 */
const getDate = (daysAgo: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

// ====== MOCK DATA GENERATORS ======

/**
 * Generate mock users
 */
const generateMockUsers = (count: number = 20) => {
  const firstNames = ["John", "Jane", "Michael", "Sarah", "David", "Emma", "James", "Lisa", "Robert", "Mary"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
  const users = [];

  for (let i = 0; i < count; i++) {
    users.push({
      uid: generateUid(),
      full_name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
      email: `user${i + 1}@example.com`,
      phone_number: `+1-555-${String(i + 1000).padStart(4, "0")}`,
      balance: randomBetween(100, 10000),
      role: i === 0 ? "Admin" : "User",
      avatar_url: {
        uid: generateUid(),
        original_name: `avatar_${i + 1}.jpg`,
        public_url: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${randomBetween(1, 99)}.jpg`,
      },
      status: i % 5 !== 0, // 80% active
    });
  }

  return users;
};

/**
 * Generate mock admins
 */
const generateMockAdmins = (count: number = 8) => {
  const admins = [];

  for (let i = 0; i < count; i++) {
    admins.push({
      uid: generateUid(),
      email: `admin${i + 1}@example.com`,
      status: i % 3 !== 0 ? "active" : "inactive", // String status: active/inactive
      created_at: getDate(30 + i),
    });
  }

  return admins;
};

/**
 * Generate mock groups
 */
const generateMockGroups = (count: number = 15) => {
  const groupNames = ["Engineering Team", "Marketing Squad", "Startup Crew", "Trip Buddies", "Study Group", "Sports Club", "Music Lovers", "Foodies", "Tech Meetup", "Game Night", "Book Club", "Fitness Group", "Travel Pack", "Business Partners", "Friends Circle"];
  const users = generateMockUsers(5);
  const groups: GroupItem[] = [];

  for (let i = 0; i < count; i++) {
    const status: "ACTIVE" | "INACTIVE" = i % 4 !== 0 ? "ACTIVE" : "INACTIVE";
    groups.push({
      uid: generateUid(),
      name: groupNames[i % groupNames.length],
      status,
      total_members: randomBetween(3, 50),
      leader: users[i % users.length],
      created_at: getDate(60 + i),
      avatar_url: {
        uid: generateUid(),
        original_name: `group_avatar_${i + 1}.jpg`,
        public_url: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${randomBetween(1, 99)}.jpg`,
      }
    });
  }

  return groups;
};

/**
 * Generate mock events
 */
const generateMockEvents = (count: number = 12) => {
  const eventNames = ["Annual Retreat", "Team Lunch", "Conference 2024", "Hackathon", "Product Launch", "Networking Event", "Training Session", "Team Building", "Workshop", "Seminar", "Meetup", "Celebration"];
  const groups = generateMockGroups(3);
  const users = generateMockUsers(3);
  const events = [];

  for (let i = 0; i < count; i++) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + i);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + randomBetween(1, 5));

    events.push({
      event_uid: generateUid(),
      event_name: eventNames[i % eventNames.length],
      event_start: startDate.toISOString(),
      event_end: endDate.toISOString(),
      status: i % 3 !== 0 ? "ACTIVE" : "INACTIVE",
      creator: users[i % users.length],
      group: groups[i % groups.length],
      event_description: `Description for ${eventNames[i % eventNames.length].toLowerCase()}`,
    });
  }

  return events;
};

/**
 * Generate mock expenses
 */
const generateMockExpenses = (count: number = 25) => {
  const expenseNames = ["Dinner", "Hotel", "Transport", "Entertainment", "Shopping", "Utilities", "Food & Drinks", "Activities", "Accommodation", "Tickets"];
  const currencies: CurrencyType[] = ['USD', 'VND', 'EUR', 'GBP', 'JPY'];
  const splitTypes: SplitType[] = ["EQUAL", "PERCENTAGE", "EXACT", "SHARE"];
  const statuses: ExpenseStatus[] = ["ACTIVE", "INACTIVE", "SETTLED", "CANCELLED"];
  const categories: string[] = ["Food & Drinks", "Transport", "Entertainment", "Accommodation", "Shopping", "Utilities", "Activities", "Other"];
  const expenses = [];
  const users = generateMockUsers(5);
  const events = generateMockEvents(3);

  for (let i = 0; i < count; i++) {
    expenses.push({
      uid: generateUid(),
      expense_uid: generateUid(),
      name: expenseNames[i % expenseNames.length],
      category: categories[i % categories.length],
      currency: currencies[i % currencies.length],
      total_amount: randomBetween(50, 5000),
      split_type: splitTypes[i % splitTypes.length],
      status: statuses[i % statuses.length],
      created_at: getDate(i),
      created_by: users[i % users.length],
      created_by_uid: users[i % users.length].uid,
      event: {
        uid: events[i % events.length].event_uid,
        name: events[i % events.length].event_name,
      },
      event_uid: events[i % events.length].event_uid,
      description: `${expenseNames[i % expenseNames.length]} for event`,
      paid_by: users[(i + 1) % users.length],
      creator: users[(i + 1) % users.length],
      payer_uid: users[(i + 1) % users.length].uid,
      note: `Note for ${expenseNames[i % expenseNames.length].toLowerCase()}`,
      expense_date: getDate(i),
      list_user_shares: [
        {
          amount: randomBetween(10, 1000),
          user: users[i % users.length]
        }
      ]
    });
  }

  return expenses;
};

/**
 * Generate mock transactions
 */
const generateMockTransactions = (count: number = 30) => {
  const types: ("withdraw" | "deposit" | "transaction")[] = ["withdraw", "deposit", "transaction"];
  const currencies = ["USD", "VND", "EUR", "GBP", "JPY"];
  const users = generateMockUsers(8);
  const transactions = [];

  for (let i = 0; i < count; i++) {
    transactions.push({
      uid: generateUid(),
      transaction_uid: generateUid(),
      type: types[i % types.length],
      amount: randomBetween(100, 50000),
      currency: currencies[i % currencies.length],
      status: i % 10 !== 0 ? "completed" : "pending",
      user: users[i % users.length],
      user_uid: users[i % users.length].uid,
      bank_account: {
        bank_name: `Bank ${String.fromCharCode(65 + (i % 5))}`,
        account_number: `****${String(i + 1000).slice(-4)}`,
      },
      to_user: users[(i + 1) % users.length],
      to_user_uid: users[(i + 1) % users.length].uid,
      created_at: getDate(i),
      description: `${types[i % types.length]} transaction`,
      code: `TXN${String(i + 1).padStart(5, "0")}`,
      group_uid: i % 3 === 0 ? generateUid() : null,
    });
  }

  return transactions;
};

/**
 * Generate mock notifications
 */
const generateMockNotifications = (count: number = 20) => {
  const notificationTypes:  ("System" | "Warning" | "Announcement" | "Reminder")[]= ["System", "Warning", "Announcement", "Reminder"];
  const contents = [
    "New user registration",
    "System maintenance scheduled",
    "Important announcement",
    "Reminder: Update your profile",
    "Transaction completed",
    "Group invitation received",
    "Event starting soon",
    "Expense added to group",
  ];
  const users = generateMockUsers(5);
  const notifications = [];

  for (let i = 0; i < count; i++) {
    notifications.push({
      uid: generateUid(),
      notification_uid: generateUid(),
      created_at: getDate(i % 7),
      content: contents[i % contents.length],
      type: notificationTypes[i % notificationTypes.length],
      related_uid: i % 2 === 0 ? generateUid() : null,
      from_user: users[0],
      to_users: [users[i % users.length]],
      is_broadcast: i % 5 === 0,
      read: i % 3 !== 0,
    });
  }

  return notifications;
};

/**
 * Generate mock messages
 */
const generateMockMessages = (count: number = 50) => {
  const sampleMessages = [
    "Hey, how are you?",
    "Did you see the latest update?",
    "Let's schedule a meeting",
    "Great work on the project!",
    "Can you review this?",
    "Thanks for the help!",
    "See you tomorrow",
    "Perfect, let's go with this approach",
  ];
  const users = generateMockUsers(8);
  const messages = [];
  const statuses: MessageStatus[] = ["ACTIVE", "DELETED", "EDITED"];

  for (let i = 0; i < count; i++) {
    messages.push({
        name: `Group ${String.fromCharCode(65 + (i % 5))}`,
        total_members: randomBetween(5, 50),
        total_messages: randomBetween(0, 100),
        messages: [
            {
                uid: generateUid(),
                message_uid: generateUid(),
                sender: users[i % users.length],
                sender_uid: users[i % users.length].uid,
                content: sampleMessages[i % sampleMessages.length],
                attachments: i % 5 === 0 ? [{ uid: generateUid(), original_name: `file_${i}.pdf`, public_url: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${randomBetween(1, 99)}.jpg` }] : [],
                status: statuses[i % statuses.length],
                created_at: getDate(i % 10),
                updated_at: i % 3 === 0 ? getDate(i % 5) : undefined,}
        ],
        avatar_url: {
            uid: generateUid(),
            original_name: `group_avatar_${i + 1}.jpg`,
            public_url: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${randomBetween(1, 99)}.jpg`,
        }
    });
  }

  return messages;
};

/**
 * Generate mock system logs
 */
const generateMockSystemLogs = (count: number = 100) => {
  const paths = [
    "/admin/users",
    "/admin/groups",
    "/admin/events",
    "/admin/expenses",
    "/admin/transactions",
    "/admin/notifications",
    "/admin/messages",
    "/admin/admins",
    "/admin/system-logs",
  ];
  const users = generateMockUsers(10);
  const logs = [];
  const methods: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

  for (let i = 0; i < count; i++) {
    logs.push({
      uid: generateUid(),
      log_uid: generateUid(),
      user: users[i % users.length],
      user_uid: users[i % users.length].uid,
      path: paths[i % paths.length],
      method_type: methods[i % methods.length],
      status_code: i % 20 === 0 ? 400 : 200,
      response_time: randomBetween(50, 500),
      created_at: getDate(i % 30),
      ip_address: `192.168.1.${i % 255}`,
      updated_at: getDate(i % 30),
      log_message: `Handled ${methods[i % methods.length]} request to ${paths[i % paths.length]} with status ${i % 20 === 0 ? 400 : 200}`,
    });
  }

  return logs;
};

/**
 * Generate mock dashboard stats
 */
const generateMockDashboardStats = () => {
  return {
    total_users: randomBetween(500, 2000),
    percent_increase_users: randomBetween(5, 25),
    percent_increase_transactions: randomBetween(10, 40),
    percent_increase_money: randomBetween(8, 35),
    percent_increase_new_users: randomBetween(3, 20),
    total_transactions: randomBetween(100, 5000),
    new_users: randomBetween(10, 100),
    total_money: randomBetween(100000, 5000000),
  };
};

/**
 * Generate mock user insights
 */
const generateMockUserInsights = () => {
  const months = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthYear = `${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
    months.push({
      month_year: monthYear,
      new_users: randomBetween(20, 200),
      loyal_users: randomBetween(100, 500),
      return_users: randomBetween(50, 300),
    });
  }
  return months;
};

/**
 * Generate mock expense categories
 */
const generateMockExpenseCategories = () => {
  const categories = ["Food & Drinks", "Transport", "Entertainment", "Accommodation", "Shopping", "Utilities", "Activities", "Other"];
  return categories.map((category) => ({
    category,
    total_amount: randomBetween(500, 10000),
  }));
};

/**
 * Generate mock cash chart data
 */
const generateMockCashData = () => {
  const data = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      day: date.toISOString(), // YYYY-MM-DD format only
      deposit: randomBetween(10000, 50000),
      withdraw: randomBetween(5000, 30000),
    });
  }
  return data;
};

/**
 * Generate mock ratings (12 months)
 */
const generateMockRatings = () => {
  const ratings = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    ratings.push({
      date: date.toISOString(),
      rate: parseFloat((Math.random() * 5).toFixed(1)),
    });
  }
  return ratings;
};

// ====== CACHE FOR MUTATION OPERATIONS ======
// In a real scenario, this would be state management or backend storage
const mockUsersCache = generateMockUsers(20);
let mockAdminsCache = generateMockAdmins(8);
const mockGroupsCache = generateMockGroups(15);
const mockEventsCache = generateMockEvents(12);
const mockExpensesCache = generateMockExpenses(25);
const mockTransactionsCache = generateMockTransactions(30);
let mockNotificationsCache = generateMockNotifications(20);
const mockMessagesCache = generateMockMessages(50);

// ====== MOCK API FUNCTIONS ======

export const mockApi = {
  // ===== USERS =====
  listUsers: async (params?: { search?: string; page?: number; page_size?: number }) => {
    await delay();
    const page = params?.page ?? 1;
    const pageSize = params?.page_size ?? 10;
    const search = params?.search ?? "";

    let filtered = mockUsersCache;
    if (search) {
      filtered = filtered.filter(
        (u) =>
          u.full_name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    const start = (page - 1) * pageSize;
    const content = filtered.slice(start, start + pageSize);

    return {
      content,
      current_page: page,
      page_size: pageSize,
      total_rows: filtered.length,
      total_pages: Math.ceil(filtered.length / pageSize),
    };
  },

  searchUsers: async (params: { search: string; page?: number; page_size?: number }) => {
    await delay();
    const page = params?.page ?? 1;
    const pageSize = params?.page_size ?? 10;

    const filtered = mockUsersCache.filter(
      (u) =>
        u.full_name.toLowerCase().includes(params.search.toLowerCase()) ||
        u.email.toLowerCase().includes(params.search.toLowerCase())
    );

    const start = (page - 1) * pageSize;
    const content = filtered.slice(start, start + pageSize).map((u) => ({
      uid: u.uid,
      full_name: u.full_name,
      email: u.email,
      balance: u.balance,
      avatar_url: u.avatar_url,
      status: u.status ? "active" : "inactive",
      date_joined: getDate(30),
    }));

    return {
      content,
      current_page: page,
      page_size: pageSize,
      total_rows: filtered.length,
      total_pages: Math.ceil(filtered.length / pageSize),
    };
  },

  getUserDetail: async (userUid: string) => {
    await delay();
    const user = mockUsersCache.find((u) => u.uid === userUid);
    if (!user) throw new Error("User not found");

    return {
      uid: user.uid,
      email: user.email,
      full_name: user.full_name,
      phone_number: user.phone_number,
      status: user.status,
      joined: getDate(30),
      role: user.role || "User",
      total_expenses: randomBetween(5, 50),
      total_groups: randomBetween(2, 20),
      total_balance: user.balance,
      last_login: getDate(2),
      avatar_url: user.avatar_url,
    };
  },

  activateUser: async (userUid: string) => {
    await delay();
    const user = mockUsersCache.find((u) => u.uid === userUid);
    if (!user) throw new Error("User not found");
    user.status = true;
    return true;
  },

  deActivateUser: async (userUid: string) => {
    await delay();
    const user = mockUsersCache.find((u) => u.uid === userUid);
    if (!user) throw new Error("User not found");
    user.status = false;
    return true;
  },

  listUserGroups: async (_userUid: string, params?: { search?: string; page?: number; page_size?: number }) => {
    await delay();
    const page = params?.page ?? 1;
    const pageSize = params?.page_size ?? 10;

    const filtered = mockGroupsCache.map((g) => ({
      group_uid: g.uid,
      group_name: g.name,
      role: "Member",
      joined_at: getDate(randomBetween(1, 30)),
    }));

    const start = (page - 1) * pageSize;
    const content = filtered.slice(start, start + pageSize);

    return {
      content,
      current_page: page,
      page_size: pageSize,
      total_rows: filtered.length,
      total_pages: Math.ceil(filtered.length / pageSize),
    };
  },

  listUserExpenses: async (userUid: string, params?: { search?: string; page?: number; page_size?: number }) => {
    await delay();
    const page = params?.page ?? 1;
    const pageSize = params?.page_size ?? 10;

    const filtered = mockExpensesCache.filter((e) => e.created_by_uid === userUid || e.payer_uid === userUid);

    const start = (page - 1) * pageSize;
    const content = filtered.slice(start, start + pageSize).map((e) => ({
      expense_uid: e.expense_uid,
      name: e.name,
      amount: e.total_amount,
      currency: e.currency,
      expense_date: e.created_at,
      end_date: getDate(0),
    }));

    return {
      content,
      current_page: page,
      page_size: pageSize,
      total_rows: filtered.length,
      total_pages: Math.ceil(filtered.length / pageSize),
    };
  },

  getUserLoginHistory: async (_userUid: string, params?: { page?: number; page_size?: number }) => {
    await delay();
    const page = params?.page ?? 1;
    const pageSize = params?.page_size ?? 10;

    const loginHistory = [];
    for (let i = 0; i < 50; i++) {
      loginHistory.push({
        uid: generateUid(),
        created_at: getDate(i),
        user: mockUsersCache[0]?.full_name || "User",
        platform: ["Web", "Mobile", "Desktop"][i % 3],
        device_model: ["iPhone 14", "Samsung S23", "MacBook Pro"][i % 3],
        os_version: ["iOS 16", "Android 13", "macOS 13"][i % 3],
        app_version: "1.0.0",
        location: ["New York", "Los Angeles", "Chicago"][i % 3],
      });
    }

    const start = (page - 1) * pageSize;
    const content = loginHistory.slice(start, start + pageSize);

    return {
      content,
      current_page: page,
      page_size: pageSize,
      total_rows: loginHistory.length,
      total_pages: Math.ceil(loginHistory.length / pageSize),
    };
  },

  // ===== ADMINS =====
  listAdmins: async (params?: { search?: string; page?: number; page_size?: number }) => {
    await delay();
    const page = params?.page ?? 1;
    const pageSize = params?.page_size ?? 10;

    let filtered = mockAdminsCache;
    if (params?.search) {
      filtered = filtered.filter((a) =>
        a.email.toLowerCase().includes(params.search!.toLowerCase())
      );
    }

    const start = (page - 1) * pageSize;
    const content = filtered.slice(start, start + pageSize);

    return {
      content,
      current_page: page,
      page_size: pageSize,
      total_rows: filtered.length,
      total_pages: Math.ceil(filtered.length / pageSize),
    };
  },

  createAdmin: async (data: { email: string }) => {
    await delay();
    const newAdmin = {
      uid: generateUid(),
      email: data.email,
      status: "active",
      created_at: getDate(0),
    };
    mockAdminsCache.push(newAdmin);
    return newAdmin;
  },

  deleteAdmin: async (adminUid: string) => {
    await delay();
    mockAdminsCache = mockAdminsCache.filter((a) => a.uid !== adminUid);
    return true;
  },

  activateAdmin: async () => {
    // In real API, activation uses password and token
    // For mock, just return true
    await delay();
    return true;
  },
  
  deActivateAdmin: async (adminUid: string) => {
    await delay();
    const admin = mockAdminsCache.find((a) => a.uid === adminUid);
    if (!admin) throw new Error("Admin not found");
    admin.status = "inactive";
    return true;
  },

  // ===== DASHBOARD =====
  getTodayOverview: async () => {
    await delay();
    return generateMockDashboardStats();
  },

  getUserInsights: async () => {
    await delay();
    return generateMockUserInsights();
  },

  getExpenseCategories: async () => {
    await delay();
    return generateMockExpenseCategories();
  },

  getCashData: async () => {
    await delay();
    return generateMockCashData();
  },

  getRatings: async () => {
    await delay();
    return generateMockRatings();
  },

  // ===== GROUPS =====
  listGroups: async (params?: { search?: string; page?: number; page_size?: number }) => {
    await delay();
    const page = params?.page ?? 1;
    const pageSize = params?.page_size ?? 10;

    let filtered = mockGroupsCache;
    if (params?.search) {
      filtered = filtered.filter((g) =>
        g.name.toLowerCase().includes(params.search!.toLowerCase())
      );
    }

    const start = (page - 1) * pageSize;
    const content = filtered.slice(start, start + pageSize);

    return {
      content,
      current_page: page,
      page_size: pageSize,
      total_rows: filtered.length,
      total_pages: Math.ceil(filtered.length / pageSize),
    };
  },

  getGroupDetail: async (groupUid: string) => {
    await delay();
    const group = mockGroupsCache.find((g) => g.uid === groupUid);
    if (!group) throw new Error("Group not found");
    return group;
  },

  listGroupMembers: async (_groupUid: string, params?: GetGroupMembersParams) => {
    await delay();
    const page = params?.page ?? 1;
    const pageSize = params?.page_size ?? 10;

    let filtered = mockUsersCache.map((u) => ({
      group_members_uid: generateUid(),
      user: {
        full_name: u.full_name,
        email: u.email,
        balance: u.balance,
        avatar_url: u.avatar_url,
        uid: u.uid,
      },
      joined_at: getDate(randomBetween(1, 30)),
    }));

    if (params?.search) {
      filtered = filtered.filter((member) =>
        member.user.full_name.toLowerCase().includes(params.search!.toLowerCase())
      );
    }

    const start = (page - 1) * pageSize;
    const content = filtered.slice(start, start + pageSize);

    return {
      content,
      current_page: page,
      page_size: pageSize,
      total_rows: filtered.length,
      total_pages: Math.ceil(filtered.length / pageSize),
    };
  },

  updateGroup: async (groupUid: string, data: Partial<GroupItem>) => {
    await delay();
    const group = mockGroupsCache.find((g) => g.uid === groupUid);
    if (!group) throw new Error("Group not found");
    Object.assign(group, data);
    return group;
  },

  // ===== EVENTS =====
  listEvents: async (params?: { search?: string; page?: number; page_size?: number }) => {
    await delay();
    const page = params?.page ?? 1;
    const pageSize = params?.page_size ?? 10;

    let filtered = mockEventsCache;
    if (params?.search) {
      filtered = filtered.filter((e) =>
        e.event_name.toLowerCase().includes(params.search!.toLowerCase())
      );
    }

    const start = (page - 1) * pageSize;
    const content = filtered.slice(start, start + pageSize);

    return {
      content,
      current_page: page,
      page_size: pageSize,
      total_rows: filtered.length,
      total_pages: Math.ceil(filtered.length / pageSize),
    };
  },

  getEventDetail: async (eventUid: string) => {
    await delay();
    const event = mockEventsCache.find((e) => e.event_uid === eventUid);
    if (!event) throw new Error("Event not found");
    return event;
  },

  listEventMembers: async (_eventUid: string, params?: { search?: string; page?: number; page_size?: number }) => {
    await delay();
    const page = params?.page ?? 1;
    const pageSize = params?.page_size ?? 10;

    let filtered = mockUsersCache.map((u) => ({
      event_member_uid: generateUid(),
      status: "ACTIVE",
      user_infor: u,
    }));

    if (params?.search) {
      filtered = filtered.filter((member) =>
        member.user_infor.full_name.toLowerCase().includes(params.search!.toLowerCase())
      );
    }

    const start = (page - 1) * pageSize;
    const content = filtered.slice(start, start + pageSize);

    return {
      content,
      current_page: page,
      page_size: pageSize,
      total_rows: filtered.length,
      total_pages: Math.ceil(filtered.length / pageSize),
    };
  },

  listEventExpenses: async (eventUid: string): Promise<ExpenseSimpleListResponse> => {
    await delay();
    const filtered = mockExpensesCache
      .filter((e) => e.event_uid === eventUid)
      .map((e) => ({
        uid: e.uid,
        name: e.name,
        currency: e.currency as CurrencyType,
        total_amount: e.total_amount,
        event: {
          uid: e.event_uid,
          name: e.name,
        },
        paid_by: e.paid_by,
        creator: e.created_by,
        split_type: e.split_type as SplitType,
        note: e.description,
        expense_date: e.created_at,
        status: e.status as ExpenseStatus,
      }));

    const total_amount = filtered.reduce((sum, expense) => sum + expense.total_amount, 0);

    return {
      expenses: filtered,
      total_amount,
    };
  },

  updateEvent: async (eventUid: string, data: Partial<EventItem>) => {
    await delay();
    const event = mockEventsCache.find((e) => e.event_uid === eventUid);
    if (!event) throw new Error("Event not found");
    Object.assign(event, data);
    return event;
  },

  // ===== EXPENSES =====
  listExpenses: async (params?: { search?: string; page?: number; page_size?: number }) => {
    await delay();
    const page = params?.page ?? 1;
    const pageSize = params?.page_size ?? 10;

    let filtered = mockExpensesCache;
    if (params?.search) {
      filtered = filtered.filter((e) =>
        e.name.toLowerCase().includes(params.search!.toLowerCase())
      );
    }

    const start = (page - 1) * pageSize;
    const content = filtered.slice(start, start + pageSize);

    return {
      content,
      current_page: page,
      page_size: pageSize,
      total_rows: filtered.length,
      total_pages: Math.ceil(filtered.length / pageSize),
    };
  },

  getExpenseDetail: async (expenseUid: string) => {
    await delay();
    const expense = mockExpensesCache.find((e) => e.expense_uid === expenseUid || e.uid === expenseUid);
    if (!expense) throw new Error("Expense not found");
    return expense;
  },

  getExpenseAttachments: async () => {
    await delay();
    return [
        {
            uid: generateUid(),
            original_name: "receipt.pdf",
            public_url: "https://example.com/receipt.pdf",
            size: 1024,
            created_at: getDate(0),
        },
        {
            uid: generateUid(),
            original_name: "invoice.jpg",
            public_url: "https://example.com/invoice.jpg",
            size: 2048,
            created_at: getDate(0),
        },
    ];
  },

  deActivateExpense: async (expenseUid: string) => {
    await delay();
    const expense = mockExpensesCache.find((e) => e.expense_uid === expenseUid || e.uid === expenseUid);
    if (!expense) throw new Error("Expense not found");
    expense.status = "INACTIVE";
    return true;
  },

  // ===== TRANSACTIONS =====
  listTransactions: async (params?: { search?: string; page?: number; page_size?: number }) => {
    await delay();
    const page = params?.page ?? 1;
    const pageSize = params?.page_size ?? 10;

    const filtered = mockTransactionsCache;

    const start = (page - 1) * pageSize;
    const content = filtered.slice(start, start + pageSize);

    return {
      content,
      current_page: page,
      page_size: pageSize,
      total_rows: filtered.length,
      total_pages: Math.ceil(filtered.length / pageSize),
    };
  },

  // ===== NOTIFICATIONS =====
  getNotificationStats: async () => {
    await delay();
    return {
      total_notifications: mockNotificationsCache.length,
      total_users: mockUsersCache.length,
      notifications_today: randomBetween(5, 20),
      percent_increase_notifications_today: randomBetween(5, 30),
      percent_increase_total_notifications: randomBetween(10, 50),
      percent_increase_users: randomBetween(5, 25),
    };
  },

  listNotifications: async (params?: { search?: string; type?: string; page?: number; page_size?: number }) => {
    await delay();
    const page = params?.page ?? 1;
    const pageSize = params?.page_size ?? 10;

    let filtered = mockNotificationsCache;
    if (params?.search) {
      filtered = filtered.filter((n) =>
        n.content.toLowerCase().includes(params.search!.toLowerCase())
      );
    }
    if (params?.type) {
      filtered = filtered.filter((n) => n.type === params.type);
    }

    const start = (page - 1) * pageSize;
    const content = filtered.slice(start, start + pageSize);

    return {
      content,
      current_page: page,
      page_size: pageSize,
      total_rows: filtered.length,
      total_pages: Math.ceil(filtered.length / pageSize),
    };
  },

  createNotification: async (payload: CreateNotificationPayload) => {
    await delay();
    const newNotification = {
      uid: generateUid(),
      notification_uid: generateUid(),
      created_at: getDate(0),
      content: payload.content,
      type: payload.type,
      related_uid: payload.related_uid || null,
      from_user: mockUsersCache[0],
      to_users: payload.to_user_uids
        .map((uid: string) => mockUsersCache.find((u) => u.uid === uid))
        .filter((u): u is typeof mockUsersCache[number] => u !== undefined),
      is_broadcast: payload.is_broadcast,
      read: false,
    };
    mockNotificationsCache.push(newNotification);
    return newNotification;
  },

  deleteNotification: async (notificationUid: string) => {
    await delay();
    mockNotificationsCache = mockNotificationsCache.filter((n) => n.uid !== notificationUid);
    return true;
  },

  // ===== MESSAGES =====
  getMessageGroups: async () => {
    await delay();
    const groupNames = [
      "Project Alpha",
      "Marketing Team",
      "Engineering Squad",
      "Sales Group",
      "Product Management",
      "Design Team",
      "Customer Support",
      "Finance Department",
    ];
    const messageContents = [
      "Let's sync up tomorrow",
      "Check the latest updates in the doc",
      "Great work on the presentation!",
      "Can someone review my code?",
      "Meeting at 2 PM today",
      "New features are ready for testing",
      "Thanks for your help!",
      "Deadline moved to next Friday",
      "Any blockers we need to address?",
      "Approved! Let's move forward",
    ];

    const groups = [];
    for (let i = 0; i < 8; i++) {
      const totalMessages = randomBetween(50, 500);
      const unreadCount = randomBetween(0, Math.min(totalMessages, 20));
      
      groups.push({
        uid: generateUid(),
        group_name: groupNames[i],
        last_message_time: getDate(randomBetween(0, 7)),
        total_members: randomBetween(3, 25),
        total_messages: totalMessages,
        total_messages_unread: unreadCount,
        last_message: getDate(randomBetween(0, 7)),
        last_message_content: messageContents[randomBetween(0, messageContents.length - 1)],
      });
    }
    return groups;
  },

  listMessages: async (_groupUid: string, params?: { search?: string | null; page?: number; page_size?: number }) => {
    await delay();
    const page = params?.page ?? 1;
    const pageSize = params?.page_size ?? 10;

    let filtered = mockMessagesCache;
    if (params?.search) {
      filtered = filtered.filter((group) =>
        group.messages.some((m) =>
          m.content.toLowerCase().includes(params.search!.toLowerCase())
        )
      );
    }

    const start = (page - 1) * pageSize;
    const content = filtered.slice(start, start + pageSize);

    return {
      content,
      current_page: page,
      page_size: pageSize,
      total_rows: filtered.length,
      total_pages: Math.ceil(filtered.length / pageSize),
    };
  },

  // ===== SYSTEM LOGS =====
  listSystemLogs: async (params?: { search?: string; page?: number; page_size?: number }) => {
    await delay();
    const page = params?.page ?? 1;
    const pageSize = params?.page_size ?? 10;

    const filtered = generateMockSystemLogs(100);

    const start = (page - 1) * pageSize;
    const content = filtered.slice(start, start + pageSize);

    return {
      content,
      current_page: page,
      page_size: pageSize,
      total_rows: filtered.length,
      total_pages: Math.ceil(filtered.length / pageSize),
    };
  },

  // ===== AUTH =====
  login: async (email: string, password: string) => {
    await delay();
    if (!email || !password) {
      throw new Error("Invalid credentials");
    }

    return {
      access_token: `mock_token_${Date.now()}`,
      refresh_token: `mock_refresh_${Date.now()}`,
      user: {
        uid: generateUid(),
        email,
        full_name: "Demo User",
        role: "Admin",
        avatar_url: {
          uid: generateUid(),
          original_name: "avatar.jpg",
          public_url: `https://randomuser.me/api/portraits/${randomBetween(1, 99)}.jpg`,
        },
      },
    };
  },
};

export default mockApi;

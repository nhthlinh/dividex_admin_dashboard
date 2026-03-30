/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * MOCK API REFACTORING DOCUMENTATION
 * 
 * This file demonstrates the refactoring pattern applied across all API modules.
 * 
 * ============================================================
 * QUICK START
 * ============================================================
 * 
 * 1. Toggle mock mode in src/services/mockApi.ts:
 *    const USE_MOCK = true;  // Use mock data
 *    const USE_MOCK = false; // Use real API
 * 
 * 2. That's it! All API calls will automatically switch between mock and real.
 * 
 * ============================================================
 * BEFORE → AFTER PATTERN
 * ============================================================
 * 
 * BEFORE (Old API call - direct axios):
 * ────────────────────────────────
 * 
 *   import { api } from "../../config/api.config";
 *   
 *   export const UserAPI = {
 *     listUsers: async (params) => {
 *       const res = await api.get("/admin/users", { params });
 *       return res.data.data;
 *     },
 *   };
 * 
 * 
 * AFTER (New pattern - with mock API):
 * ──────────────────────────────────────
 * 
 *   import { api } from "../../config/api.config";
 *   import { mockApi, USE_MOCK } from "../../services/mockApi";
 *   
 *   export const UserAPI = {
 *     listUsers: async (params) => {
 *       if (USE_MOCK) {
 *         return mockApi.listUsers(params);
 *       }
 *       
 *       const res = await api.get("/admin/users", { params });
 *       return res.data.data;
 *     },
 *   };
 * 
 */

import { api } from "../config/api.config";
import mockApi, { USE_MOCK } from "./mockApi";

// ============================================================
// PRACTICAL EXAMPLES
// ============================================================

// ─── EXAMPLE 1: Simple GET Request ─────────────────────────

// BEFORE:
export const Example1Before = {
  getUsers: async () => {
    const res = await api.get("/admin/users");
    return res.data.data;
  }
};

// AFTER:
export const Example1After = {
  getUsers: async () => {
    if (USE_MOCK) {
      return mockApi.listUsers();
    }
    
    const res = await api.get("/admin/users");
    return res.data.data;
  }
};

// ─── EXAMPLE 2: GET with Parameters ──────────────────────

// BEFORE:
export const Example2Before = {
  listUsers: async (params: { search: any; page: any; page_size: any; }) => {
    const res = await api.get("/admin/users", {
      params: {
        search: params.search,
        page: params.page ?? 1,
        page_size: params.page_size ?? 10,
      },
    });
    return res.data.data;
  }
};

// AFTER:
export const Example2After = {
  listUsers: async (params: { search: any; page: any; page_size: any; }) => {
    if (USE_MOCK) {
      return mockApi.listUsers(params);
    }
    
    const res = await api.get("/admin/users", {
      params: {
        search: params.search,
        page: params.page ?? 1,
        page_size: params.page_size ?? 10,
      },
    });
    return res.data.data;
  }
};

// ─── EXAMPLE 3: POST Request (Create) ────────────────────

// BEFORE:
export const Example3Before = {
  createAdmin: async (data: any) => {
    await api.post('/admin', data)
  }
};

// AFTER:
export const Example3After = {
  createAdmin: async (data: any) => {
    if (USE_MOCK) {
      await mockApi.createAdmin(data);
      return;
    }
    
    await api.post('/admin', data)
  }
};

// ─── EXAMPLE 4: PATCH Request (Update) ─────────────────────

// BEFORE:
export const Example4Before = {
  activateUser: async (userUid: any) => {
    const res = await api.patch(`/admin/users/${userUid}/activate`);
    return res.data.data;
  }
};

// AFTER:
export const Example4After = {
  activateUser: async (userUid: any) => {
    if (USE_MOCK) {
      return mockApi.activateUser(userUid);
    }
    
    const res = await api.patch(`/admin/users/${userUid}/activate`);
    return res.data.data;
  }
};

// ─── EXAMPLE 5: DELETE Request ─────────────────────────────

// BEFORE:
export const Example5Before = {
  deleteAdmin: async (adminUid: any) => {
    await api.delete(`/admin/${adminUid}`)
  }
};

// AFTER:
export const Example5After = {
  deleteAdmin: async (adminUid: any) => {
    if (USE_MOCK) {
      await mockApi.deleteAdmin(adminUid);
      return;
    }
    
    await api.delete(`/admin/${adminUid}`)
  }
};

// ============================================================
// MOCK API AVAILABLE FUNCTIONS
// ============================================================

/**
 * mockApi.listUsers(params)
 * - Returns paginated list of users with mock data
 * - Params: { search?, page?, page_size? }
 * - Simulates 400ms network delay
 */

/**
 * mockApi.searchUsers(params)
 * - Search users with pagination
 * - Params: { search (required), page?, page_size? }
 */

/**
 * mockApi.getUserDetail(userUid)
 * - Get single user details
 * - Returns complete user profile
 */

/**
 * mockApi.activateUser(userUid)
 * - Activate a user (updates local cache)
 * - Returns boolean
 */

/**
 * mockApi.deActivateUser(userUid)
 * - Deactivate a user (updates local cache)
 * - Returns boolean
 */

/**
 * mockApi.listUserGroups(userUid, params)
 * - Get all groups user belongs to
 * - Params: { search?, page?, page_size? }
 */

/**
 * mockApi.getUserLoginHistory(userUid, params)
 * - Get user's login history with device info
 * - Params: { page?, page_size? }
 */

// ─── ADMINS ─────────────────────────────────────────────

/**
 * mockApi.listAdmins(params)
 * - List all admins
 * - Params: { search?, page?, page_size? }
 */

/**
 * mockApi.createAdmin(data)
 * - Create new admin (updates local cache)
 * - Data: { email, name }
 */

/**
 * mockApi.deleteAdmin(adminUid)
 * - Delete admin
 */

/**
 * mockApi.activateAdmin(data)
 * - Activate admin
 * - Data: { admin_uid }
 */

/**
 * mockApi.deActivateAdmin(adminUid)
 * - Deactivate admin
 */

// ─── DASHBOARD ───────────────────────────────────────────

/**
 * mockApi.getTodayOverview()
 * - Dashboard overview stats (total users, transactions, money, etc.)
 */

/**
 * mockApi.getUserInsights()
 * - Monthly user insights for the year (12 months)
 * - Returns array of { month_year, new_users, loyal_users, return_users }
 */

/**
 * mockApi.getExpenseCategories()
 * - Expense breakdown by category
 * - Returns array of { category, total_amount }
 */

/**
 * mockApi.getCashData()
 * - Monthly income/expense data
 * - Returns array of { month, income, expense }
 */

/**
 * mockApi.getRatings(start?, end?)
 * - Daily ratings for last 30 days
 * - Returns array of { date, rate }
 */

// ─── GROUPS ─────────────────────────────────────────────

/**
 * mockApi.listGroups(params)
 * - List all groups
 * - Params: { search?, page?, page_size? }
 */

/**
 * mockApi.getGroupDetail(groupUid)
 * - Get single group details
 */

/**
 * mockApi.listGroupMembers(groupUid, params)
 * - Get all members in a group
 * - Params: { search?, page?, page_size? }
 */

/**
 * mockApi.updateGroup(groupUid, data)
 * - Update group data
 * - Data: any group properties to update (updates local cache)
 */

// ─── EVENTS ─────────────────────────────────────────────

/**
 * mockApi.listEvents(params)
 * - List all events
 * - Params: { search?, page?, page_size? }
 */

/**
 * mockApi.getEventDetail(eventUid)
 * - Get single event details
 */

/**
 * mockApi.listEventMembers(eventUid, params)
 * - Get all members in an event
 * - Params: { search?, page?, page_size? }
 */

/**
 * mockApi.listEventExpenses(eventUid, params)
 * - Get all expenses in an event
 * - Params: { search?, page?, page_size? }
 */

/**
 * mockApi.updateEvent(eventUid, data)
 * - Update event data
 * - Data: any event properties to update (updates local cache)
 */

// ─── EXPENSES ────────────────────────────────────────────

/**
 * mockApi.listExpenses(params)
 * - List all expenses
 * - Params: { search?, page?, page_size? }
 */

/**
 * mockApi.getExpenseDetail(expenseUid)
 * - Get single expense details
 */

/**
 * mockApi.getExpenseAttachments(expenseUid)
 * - Get attachments for expense
 * - Returns array of { uid, name }
 */

/**
 * mockApi.deActivateExpense(expenseUid)
 * - Deactivate expense
 */

// ─── TRANSACTIONS ───────────────────────────────────────

/**
 * mockApi.listTransactions(params)
 * - List all transactions
 * - Params: { search?, page?, page_size? }
 */

// ─── NOTIFICATIONS ──────────────────────────────────────

/**
 * mockApi.getNotificationStats()
 * - Notification statistics
 */

/**
 * mockApi.listNotifications(params)
 * - List all notifications
 * - Params: { search?, type?, page?, page_size? }
 * - Type: "System" | "Warning" | "Announcement" | "Reminder"
 */

/**
 * mockApi.createNotification(payload)
 * - Create new notification (updates local cache)
 * - Payload: { content, type, to_user_uids[], is_broadcast }
 */

/**
 * mockApi.deleteNotification(notificationUid)
 * - Delete notification
 */

// ─── MESSAGES ────────────────────────────────────────────

/**
 * mockApi.getMessageGroups()
 * - Get all message groups
 */

/**
 * mockApi.listMessages(groupUid, params)
 * - Get messages in a group
 * - Params: { search?, page?, page_size? }
 */

// ─── SYSTEM LOGS ─────────────────────────────────────────

/**
 * mockApi.listSystemLogs(params)
 * - List all system logs
 * - Params: { search?, page?, page_size? }
 * - Log includes: path, method_type, status_code, response_time
 */

// ─── AUTH ────────────────────────────────────────────────

/**
 * mockApi.login(email, password)
 * - User login
 * - Returns: { access_token, refresh_token, user { uid, email, full_name, ... } }
 */

// ============================================================
// USAGE IN COMPONENTS/PAGES
// ============================================================

/**
 * No changes needed in components or pages!
 * 
 * The component code remains exactly the same. It calls the API module,
 * which now internally handles the mock vs real API switching.
 * 
 * Example:
 * 
 *   import { UserAPI } from "@features/users/user.api";
 *   
 *   const MyComponent = () => {
 *     const [users, setUsers] = useState([]);
 *   
 *     useEffect(() => {
 *       const fetchUsers = async () => {
 *         const data = await UserAPI.listUsers({ page: 1 });
 *         setUsers(data.content);
 *       };
 *       fetchUsers();
 *     }, []);
 *   
 *     return (
 *       <div>
 *         {users.map(u => <div key={u.uid}>{u.full_name}</div>)}
 *       </div>
 *     );
 *   };
 * 
 * When USE_MOCK = true:  Calls mockApi.listUsers() → Returns mock data
 * When USE_MOCK = false: Calls api.get("/admin/users") → Returns real API data
 * 
 * Component code is unchanged!
 */

// ============================================================
// HOW MUTATIONS WORK WITH MOCK DATA
// ============================================================

/**
 * State Persistence via Local Cache:
 * 
 * When you create/update/delete with mock API, the changes are stored
 * in a JavaScript cache within mockApi.ts. This allows:
 * 
 *   If USE_MOCK = true:
 *   1. Create admin → updates mockAdminsCache
 *   2. List admins → includes the newly created admin
 *   3. Delete admin → removes from cache
 *   
 *   If USE_MOCK = false:
 *   1. Create admin → calls real API → server stores it
 *   2. List admins → fetches from server
 *   3. Delete admin → calls real API → server removes it
 * 
 * Cache persists only for the browser session. Page refresh resets mock data.
 */

// ============================================================
// DEPLOYMENT & SWITCHING
// ============================================================

/**
 * To switch between mock and real APIs:
 * 
 *   File: src/services/mockApi.ts
 *   
 *   // Development with mock:
 *   export const USE_MOCK = true;
 *   
 *   // Production with real API:
 *   export const USE_MOCK = false;
 * 
 * Or use an environment variable:
 * 
 *   export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
 * 
 * Then in .env:
 *   VITE_USE_MOCK=true   # Development
 *   VITE_USE_MOCK=false  # Production
 */

// ============================================================
// TESTING WITH MOCK API
// ============================================================

/**
 * All components work with mock API immediately:
 * 
 *   npm run dev
 * 
 * This starts the dashboard with mock data. No backend needed!
 * 
 * To test specific scenarios:
 * 
 *   1. Create/update/delete operations
 *   2. Pagination and filtering
 *   3. Error handling (if backend is unreachable)
 *   4. Search functionality
 *   5. All UI without a running backend
 */

// ============================================================
// COMMON PATTERNS APPLIED
// ============================================================

/**
 * Pattern 1: Simple GET
 * 
 *   if (USE_MOCK) return mockApi.getFoo();
 *   const res = await api.get(...);
 *   return res.data.data;
 */

/**
 * Pattern 2: GET with params
 * 
 *   if (USE_MOCK) return mockApi.getFoo(params);
 *   const res = await api.get(..., { params: {...} });
 *   return res.data.data;
 */

/**
 * Pattern 3: POST/Create
 * 
 *   if (USE_MOCK) {
 *     await mockApi.createFoo(data);
 *     return;
 *   }
 *   await api.post(..., data);
 */

/**
 * Pattern 4: PATCH/Update
 * 
 *   if (USE_MOCK) return mockApi.updateFoo(id, data);
 *   const res = await api.patch(...);
 *   return res.data.data;
 */

/**
 * Pattern 5: DELETE
 * 
 *   if (USE_MOCK) {
 *     await mockApi.deleteFoo(id);
 *     return;
 *   }
 *   await api.delete(...);
 */

export {};

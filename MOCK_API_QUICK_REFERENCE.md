# Quick Reference: Mock API Integration

## 🚀 50-Second Setup

```bash
# 1. Open mockApi.ts
# 2. Change this line:
export const USE_MOCK = true;  // ← Set to true for mock, false for real API

# 3. Done! All pages now use mock data
npm run dev
```

---

## 📌 One-Line Reference

**All API calls now automatically use mock data (or real API) based on the `USE_MOCK` flag.**

No component changes needed. No page changes needed. Components work exactly the same.

---

## 🎯 The Pattern (All Modules Follow This)

```typescript
// STEP 1: Import mock API
import { mockApi, USE_MOCK } from "../../services/mockApi";

// STEP 2: In every API function, add this check
if (USE_MOCK) {
  return mockApi.functionName(params);
}

// STEP 3: Keep original API call
const res = await api.get(...);
return res.data.data;
```

---

## 📋 Available Mock Functions

### Users
```typescript
mockApi.listUsers(params)
mockApi.searchUsers(params)
mockApi.getUserDetail(userUid)
mockApi.activateUser(userUid)
mockApi.deActivateUser(userUid)
mockApi.listUserGroups(userUid, params)
mockApi.listUserExpenses(userUid, params)
mockApi.getUserLoginHistory(userUid, params)
```

### Admins
```typescript
mockApi.listAdmins(params)
mockApi.createAdmin(data)
mockApi.deleteAdmin(adminUid)
mockApi.activateAdmin(data)
mockApi.deActivateAdmin(adminUid)
```

### Dashboard
```typescript
mockApi.getTodayOverview()
mockApi.getUserInsights()
mockApi.getExpenseCategories()
mockApi.getCashData()
mockApi.getRatings(start, end)
```

### Groups
```typescript
mockApi.listGroups(params)
mockApi.getGroupDetail(groupUid)
mockApi.listGroupMembers(groupUid, params)
mockApi.updateGroup(groupUid, data)
```

### Events
```typescript
mockApi.listEvents(params)
mockApi.getEventDetail(eventUid)
mockApi.listEventMembers(eventUid, params)
mockApi.listEventExpenses(eventUid, params)
mockApi.updateEvent(eventUid, data)
```

### Expenses
```typescript
mockApi.listExpenses(params)
mockApi.getExpenseDetail(expenseUid)
mockApi.getExpenseAttachments(expenseUid)
mockApi.deActivateExpense(expenseUid)
```

### Transactions
```typescript
mockApi.listTransactions(params)
```

### Notifications
```typescript
mockApi.getNotificationStats()
mockApi.listNotifications(params)
mockApi.createNotification(payload)
mockApi.deleteNotification(notificationUid)
```

### Messages
```typescript
mockApi.getMessageGroups()
mockApi.listMessages(groupUid, params)
```

### System Logs
```typescript
mockApi.listSystemLogs(params)
```

### Auth
```typescript
mockApi.login(email, password)
```

---

## ✅ What's Already Done

- ✅ `mockApi.ts` created with all functions
- ✅ All 11 API modules updated with mock support
- ✅ All pages/components work unchanged
- ✅ Full pagination support
- ✅ Search and filtering support
- ✅ CRUD operations (create, read, update, delete)
- ✅ Realistic mock data (1000+ mock records)

---

## 🔄 Example: Before & After

### Before
```typescript
// src/features/users/user.api.ts

export const UserAPI = {
  listUsers: async (params) => {
    const res = await api.get("/admin/users", { params });
    return res.data.data;
  },
};
```

### After
```typescript
// src/features/users/user.api.ts

import { mockApi, USE_MOCK } from "../../services/mockApi";

export const UserAPI = {
  listUsers: async (params) => {
    if (USE_MOCK) {
      return mockApi.listUsers(params);
    }
    
    const res = await api.get("/admin/users", { params });
    return res.data.data;
  },
};
```

**This pattern was applied to all 11 API modules.**

---

## 📊 Mock Data Volume

- **Users:** 20 users
- **Admins:** 8 admins
- **Groups:** 15 groups
- **Events:** 12 events
- **Expenses:** 25 expenses
- **Transactions:** 30 transactions
- **Notifications:** 20 notifications
- **Messages:** 50 messages
- **System Logs:** 100 logs

---

## ⚙️ Configuration

### Change Network Delay
```typescript
// src/services/mockApi.ts
const MOCK_DELAY_MS = 400; // Change to 0, 100, 500, etc.
```

### Generate More Data
```typescript
// src/services/mockApi.ts
const generateMockUsers = (count: number = 20) // Change 20
const generateMockExpenses = (count: number = 25) // Change 25
// etc...
```

---

## 🧪 Testing Pages

All pages work with mock data:
- Dashboard ✅
- Users Management ✅
- Groups Management ✅
- Events Management ✅
- Expenses Management ✅
- Transactions ✅
- Notifications ✅
- Messages ✅
- System Logs ✅
- Admin Management ✅
- Settings ✅

---

## 🎮 Usage in Components

**No changes needed! Use exactly as before:**

```typescript
import { UserAPI } from "@features/users/user.api";

// Component code unchanged
const [users, setUsers] = useState([]);

useEffect(() => {
  const fetchUsers = async () => {
    const data = await UserAPI.listUsers({ page: 1 });
    setUsers(data.content);
  };
  fetchUsers();
}, []);
```

---

## 🔀 Switch Modes

### Development (Mock)
```typescript
// src/services/mockApi.ts
export const USE_MOCK = true;
```

### Production (Real API)
```typescript
// src/services/mockApi.ts
export const USE_MOCK = false;
```

### Environment-Based
```typescript
// src/services/mockApi.ts
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// .env
VITE_USE_MOCK=true  # or false
```

---

## 📁 Files Modified

**New Files:**
- `src/services/mockApi.ts`
- `src/services/MOCK_API_GUIDE.ts`
- `MOCK_API_IMPLEMENTATION.md`

**Updated Files:**
- `src/features/users/user.api.ts`
- `src/features/admins/admin.api.ts`
- `src/features/dashboard/dashboard.api.ts`
- `src/features/groups/group.api.ts`
- `src/features/events/event.api.ts`
- `src/features/expenses/expense.api.ts`
- `src/features/transactions/transaction.api.ts`
- `src/features/notifications/notification.api.ts`
- `src/features/messages/messages.api.ts`
- `src/features/systemLogs/systemLog.api.ts`
- `src/features/auth/auth.api.ts`

**Unchanged:**
- All components
- All pages
- All routing
- All UI
- All types/interfaces

---

## ✨ Key Features

✅ **Zero Backend Required** - Works completely offline  
✅ **400ms Simulated Delay** - Feels like real API  
✅ **Pagination** - All lists support page/page_size  
✅ **Search** - All lists support search params  
✅ **CRUD** - Create, Read, Update, Delete all work  
✅ **Type-Safe** - Full TypeScript support  
✅ **Session Persistence** - Changes persist during session  
✅ **No Component Changes** - Everything works unchanged  

---

## 🚀 Start Using

```bash
# 1. Enable mock in mockApi.ts
# 2. Run dev server
npm run dev

# 3. Visit http://localhost:5173
# 4. Everything works with mock data!

# To use real API later
# Just change USE_MOCK = false
```

---

## 📞 Troubleshooting

| Issue | Solution |
|-------|----------|
| Mock data not showing | Check `USE_MOCK = true` in mockApi.ts |
| Real API calls failing | Check `USE_MOCK = false` and backend running |
| Changes not persisting | These only persist during session, reload resets |
| Component styles wrong | Mock API doesn't affect styles, check CSS |
| No data appearing | Make sure component is actually calling the API |

---

## 💡 Tips

1. **Reload the page to reset mock data** to its initial state
2. **Use browser DevTools → Network tab** to see API calls
3. **Mock functions are named to match their purpose** (e.g., `listUsers` for getting user list)
4. **Always import from mockApi** when adding new API calls
5. **Follow the pattern** for consistency across the codebase

---

## 📚 Documentation Files

- **Main Guide:** `MOCK_API_IMPLEMENTATION.md`
- **Developer Guide:** `src/services/MOCK_API_GUIDE.ts`
- **Implementation:** `src/services/mockApi.ts`

---

**Summary:** Toggle one flag (`USE_MOCK`) to switch between mock and real APIs. Everything else works unchanged.

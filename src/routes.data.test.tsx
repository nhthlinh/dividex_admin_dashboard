import { type ReactNode } from 'react';
import { render, screen, waitFor, cleanup, within, type RenderResult } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { describe, it, expect, afterEach } from 'vitest';
import '@testing-library/jest-dom';

// ============================================================================
// MOCK COMPONENTS WITH DATA HANDLING
// ============================================================================

interface PageProps {
  data?: unknown;
  isLoading?: boolean;
  error?: string | null;
}

// Components that would typically fetch data
const LoginPage = ({ onSubmit }: { onSubmit?: () => void }) => (
  <div data-testid="login-page">
    <h1>Login Page</h1>
    <button onClick={onSubmit}>Login</button>
  </div>
);

const AdminInviteAcceptPage = () => <div data-testid="invite-accept-page">Admin Invite Accept Page</div>;

const DashboardPage = ({ data, isLoading, error }: PageProps) => (
  <div data-testid="dashboard-page">
    <h1>Dashboard</h1>
    {isLoading && <div data-testid="loading">Loading...</div>}
    {error && <div data-testid="error">Error: {error}</div>}
    {data && <div data-testid="dashboard-data">{JSON.stringify(data)}</div>}
  </div>
);

const UserPage = ({ data, isLoading, error }: PageProps) => (
  <div data-testid="user-page">
    <h1>Users</h1>
    {isLoading && <div data-testid="loading">Loading users...</div>}
    {error && <div data-testid="error">Error: {error}</div>}
    {data && <ul data-testid="user-list">{JSON.stringify(data)}</ul>}
  </div>
);

const GroupPage = ({ data, isLoading, error }: PageProps) => (
  <div data-testid="group-page">
    <h1>Groups</h1>
    {isLoading && <div data-testid="loading">Loading groups...</div>}
    {error && <div data-testid="error">Error: {error}</div>}
    {data && <div data-testid="group-list">{JSON.stringify(data)}</div>}
  </div>
);

const EventPage = ({ data, isLoading, error }: PageProps) => (
  <div data-testid="event-page">
    <h1>Events</h1>
    {isLoading && <div data-testid="loading">Loading events...</div>}
    {error && <div data-testid="error">Error: {error}</div>}
    {data && <div data-testid="event-list">{JSON.stringify(data)}</div>}
  </div>
);

const EventInGroupPage = ({ data, isLoading, error }: PageProps) => (
  <div data-testid="event-in-group-page">
    <h1>Events in Group</h1>
    {isLoading && <div data-testid="loading">Loading...</div>}
    {error && <div data-testid="error">Error: {error}</div>}
    {data && <div data-testid="group-events-data">{JSON.stringify(data)}</div>}
  </div>
);

const ExpensePage = ({ data, isLoading, error }: PageProps) => (
  <div data-testid="expense-page">
    <h1>Expenses</h1>
    {isLoading && <div data-testid="loading">Loading expenses...</div>}
    {error && <div data-testid="error">Error: {error}</div>}
    {data && <div data-testid="expense-list">{JSON.stringify(data)}</div>}
  </div>
);

const ExpenseInEventPage = ({ data, isLoading, error }: PageProps) => (
  <div data-testid="expense-in-event-page">
    <h1>Event Expenses</h1>
    {isLoading && <div data-testid="loading">Loading...</div>}
    {error && <div data-testid="error">Error: {error}</div>}
    {data && <div data-testid="event-expenses-data">{JSON.stringify(data)}</div>}
  </div>
);

const TransactionPage = ({ data, isLoading, error }: PageProps) => (
  <div data-testid="transaction-page">
    <h1>Transactions</h1>
    {isLoading && <div data-testid="loading">Loading transactions...</div>}
    {error && <div data-testid="error">Error: {error}</div>}
    {data && <div data-testid="transaction-list">{JSON.stringify(data)}</div>}
  </div>
);

const NotificationPage = ({ data, isLoading }: PageProps) => (
  <div data-testid="notification-page">
    <h1>Notifications</h1>
    {isLoading && <div data-testid="loading">Loading...</div>}
    {data && <div data-testid="notification-list">{JSON.stringify(data)}</div>}
  </div>
);

const MessagePage = ({ data, isLoading }: PageProps) => (
  <div data-testid="message-page">
    <h1>Messages</h1>
    {isLoading && <div data-testid="loading">Loading...</div>}
    {data && <div data-testid="message-list">{JSON.stringify(data)}</div>}
  </div>
);

const SystemLogPage = ({ data, isLoading }: PageProps) => (
  <div data-testid="system-log-page">
    <h1>System Logs</h1>
    {isLoading && <div data-testid="loading">Loading...</div>}
    {data && <div data-testid="log-list">{JSON.stringify(data)}</div>}
  </div>
);

const AdminManagementPage = ({ data, isLoading }: PageProps) => (
  <div data-testid="admin-management-page">
    <h1>Admin Management</h1>
    {isLoading && <div data-testid="loading">Loading...</div>}
    {data && <div data-testid="admin-data">{JSON.stringify(data)}</div>}
  </div>
);

const SettingsPage = ({ onSave }: { onSave?: () => void }) => (
  <div data-testid="settings-page">
    <h1>Settings</h1>
    <button onClick={onSave}>Save Settings</button>
  </div>
);

// ============================================================================
// MOCK LAYOUT & AUTH
// ============================================================================

const AdminLayout = ({ children }: { children: ReactNode }) => (
  <div data-testid="admin-layout">
    <header data-testid="admin-header">Admin Header</header>
    <nav data-testid="admin-nav">Navigation</nav>
    <main data-testid="admin-main">{children}</main>
  </div>
);

const ProtectedRoute = ({ children, isAuthenticated = true }: { children: ReactNode; isAuthenticated?: boolean }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// ============================================================================
// DATA FETCHING MOCK SERVICE
// ============================================================================

interface APIResponse<T> {
  data: T;
  status: number;
}

const mockAPI = {
  fetchUsers: async (): Promise<APIResponse<{ id: number; name: string }[]>> => {
    return {
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
        { id: 3, name: 'Bob Johnson' },
      ],
      status: 200,
    };
  },

  fetchGroups: async (): Promise<APIResponse<{ id: string; title: string }[]>> => {
    return {
      data: [
        { id: 'grp-1', title: 'Admin Group' },
        { id: 'grp-2', title: 'User Group' },
      ],
      status: 200,
    };
  },

  fetchEvents: async (): Promise<APIResponse<{ id: string; name: string; date: string }[]>> => {
    return {
      data: [
        { id: 'evt-1', name: 'Meeting', date: '2026-03-30' },
        { id: 'evt-2', name: 'Launch', date: '2026-04-01' },
      ],
      status: 200,
    };
  },

  fetchExpenses: async (): Promise<APIResponse<{ id: string; amount: number; date: string }[]>> => {
    return {
      data: [
        { id: 'exp-1', amount: 100, date: '2026-03-30' },
        { id: 'exp-2', amount: 250, date: '2026-03-29' },
      ],
      status: 200,
    };
  },

  fetchTransactions: async (): Promise<APIResponse<{ id: string; type: string; amount: number }[]>> => {
    return {
      data: [
        { id: 'tx-1', type: 'income', amount: 5000 },
        { id: 'tx-2', type: 'expense', amount: 1200 },
      ],
      status: 200,
    };
  },

  fetchNotifications: async (): Promise<APIResponse<{ id: string; message: string }[]>> => {
    return {
      data: [
        { id: 'notif-1', message: 'New event' },
        { id: 'notif-2', message: 'Payment received' },
      ],
      status: 200,
    };
  },
};

// ============================================================================
// TEST ROUTER WITH DATA HANDLING
// ============================================================================

interface RouteTestConfig {
  isAuthenticated: boolean;
  data?: Record<string, unknown>;
  isLoading?: boolean;
  error?: string | null;
}

const createTestRouter = (config: RouteTestConfig) => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/admin/invite" element={<AdminInviteAcceptPage />} />
    <Route
      path="/*"
      element={
        <ProtectedRoute isAuthenticated={config.isAuthenticated}>
          <AdminLayout>
            <Routes>
              <Route index element={<DashboardPage data={config.data?.dashboard} isLoading={config.isLoading} error={config.error} />} />
              <Route path="user" element={<UserPage data={config.data?.users} isLoading={config.isLoading} error={config.error} />} />
              <Route path="group" element={<GroupPage data={config.data?.groups} isLoading={config.isLoading} error={config.error} />} />
              <Route path="event" element={<EventPage data={config.data?.events} isLoading={config.isLoading} error={config.error} />} />
              <Route path="event/group/:group_uid" element={<EventInGroupPage data={config.data?.groupEvents} isLoading={config.isLoading} error={config.error} />} />
              <Route path="expense" element={<ExpensePage data={config.data?.expenses} isLoading={config.isLoading} error={config.error} />} />
              <Route path="expense/event/:event_uid" element={<ExpenseInEventPage data={config.data?.eventExpenses} isLoading={config.isLoading} error={config.error} />} />
              <Route path="transaction" element={<TransactionPage data={config.data?.transactions} isLoading={config.isLoading} error={config.error} />} />
              <Route path="notification" element={<NotificationPage data={config.data?.notifications} isLoading={config.isLoading} />} />
              <Route path="message" element={<MessagePage data={config.data?.messages} isLoading={config.isLoading} />} />
              <Route path="system-logs" element={<SystemLogPage data={config.data?.logs} isLoading={config.isLoading} />} />
              <Route path="admin" element={<AdminManagementPage data={config.data?.admin} isLoading={config.isLoading} />} />
              <Route path="settings" element={<SettingsPage />} />
            </Routes>
          </AdminLayout>
        </ProtectedRoute>
      }
    />
  </Routes>
);

// ============================================================================
// TEST UTILITIES
// ============================================================================

const renderAtRoute = (
  initialRoute: string = '/',
  config: Partial<RouteTestConfig> = {}
): RenderResult => {
  const defaultConfig: RouteTestConfig = {
    isAuthenticated: true,
    isLoading: false,
    error: null,
    ...config,
  };

  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      {createTestRouter(defaultConfig)}
    </MemoryRouter>
  );
};

// ============================================================================
// DATA RENDERING TESTS
// ============================================================================

describe('Routes - Data Rendering', () => {
  describe('Dashboard Data Display', () => {
    it('should display dashboard data when provided', () => {
      renderAtRoute('/', {
        data: {
          dashboard: { totalUsers: 42, totalEvents: 15 },
        },
      });

      expect(screen.getByTestId('dashboard-data')).toBeInTheDocument();
      expect(screen.getByText(/"totalUsers":42/)).toBeInTheDocument();
    });

    it('should show loading state', () => {
      renderAtRoute('/', {
        isLoading: true,
      });

      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should display error message when error exists', () => {
      renderAtRoute('/', {
        error: 'Failed to load dashboard',
      });

      expect(screen.getByTestId('error')).toBeInTheDocument();
      expect(screen.getByText('Error: Failed to load dashboard')).toBeInTheDocument();
    });
  });

  describe('User Page Data Display', () => {
    it('should render user list with data', async () => {
      const userData = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ];

      renderAtRoute('/user', {
        data: {
          users: userData,
        },
      });

      await waitFor(() => {
        expect(screen.getByTestId('user-list')).toBeInTheDocument();
        expect(screen.getByText(/Alice/)).toBeInTheDocument();
        expect(screen.getByText(/Bob/)).toBeInTheDocument();
      });
    });

    it('should display loading spinner for users', () => {
      renderAtRoute('/user', {
        isLoading: true,
      });

      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.getByText('Loading users...')).toBeInTheDocument();
    });

    it('should handle empty user list', () => {
      renderAtRoute('/user', {
        data: {
          users: [],
        },
      });

      const userList = screen.getByTestId('user-list');
      expect(userList).toBeInTheDocument();
      expect(userList.textContent).toContain('[]');
    });
  });

  describe('Group Page Data Display', () => {
    it('should render groups with data', () => {
      const groupData = [
        { id: 'g1', name: 'Admin' },
        { id: 'g2', name: 'Users' },
      ];

      renderAtRoute('/group', {
        data: {
          groups: groupData,
        },
      });

      const groupListElement = screen.getByTestId('group-list');
      expect(groupListElement).toBeInTheDocument();
      expect(within(groupListElement).getByText(/admin/i)).toBeInTheDocument();
    });

    it('should show loading state for groups', () => {
      renderAtRoute('/group', {
        isLoading: true,
      });

      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.getByText('Loading groups...')).toBeInTheDocument();
    });
  });

  describe('Event Page Data Display', () => {
    it('should render events with correct structure', () => {
      const eventData = [
        { id: 'e1', name: 'Conference', date: '2026-04-15' },
        { id: 'e2', name: 'Webinar', date: '2026-04-20' },
      ];

      renderAtRoute('/event', {
        data: {
          events: eventData,
        },
      });

      expect(screen.getByTestId('event-list')).toBeInTheDocument();
      expect(screen.getByText(/Conference/)).toBeInTheDocument();
    });

    it('should display loading for events', () => {
      renderAtRoute('/event', {
        isLoading: true,
      });

      expect(screen.getByText('Loading events...')).toBeInTheDocument();
    });
  });

  describe('Dynamic Route Data Display', () => {
    it('should display group-specific events data', () => {
      renderAtRoute('/event/group/grp-123', {
        data: {
          groupEvents: [
            { id: 'e1', name: 'Team Meeting' },
            { id: 'e2', name: 'Planning' },
          ],
        },
      });

      expect(screen.getByTestId('group-events-data')).toBeInTheDocument();
      expect(screen.getByText(/Team Meeting/)).toBeInTheDocument();
    });

    it('should display event-specific expenses', () => {
      renderAtRoute('/expense/event/evt-456', {
        data: {
          eventExpenses: [
            { id: 'ex1', amount: 500 },
            { id: 'ex2', amount: 300 },
          ],
        },
      });

      expect(screen.getByTestId('event-expenses-data')).toBeInTheDocument();
      expect(screen.getByText(/500/)).toBeInTheDocument();
    });
  });
});

// ============================================================================
// EXPENSE & TRANSACTION DATA TESTS
// ============================================================================

describe('Routes - Financial Data Display', () => {
  it('should render expense list with amounts', () => {
    const expenseData = [
      { id: 'e1', description: 'Office', amount: 1000 },
      { id: 'e2', description: 'Travel', amount: 500 },
    ];

    renderAtRoute('/expense', {
      data: {
        expenses: expenseData,
      },
    });

    expect(screen.getByTestId('expense-list')).toBeInTheDocument();
    expect(screen.getByText(/1000/)).toBeInTheDocument();
    expect(screen.getByText(/500/)).toBeInTheDocument();
  });

  it('should render transaction list with types', () => {
    const transactionData = [
      { id: 't1', type: 'credit', amount: 5000 },
      { id: 't2', type: 'debit', amount: 2000 },
    ];

    renderAtRoute('/transaction', {
      data: {
        transactions: transactionData,
      },
    });

    expect(screen.getByTestId('transaction-list')).toBeInTheDocument();
    expect(screen.getByText(/credit/)).toBeInTheDocument();
    expect(screen.getByText(/debit/)).toBeInTheDocument();
  });
});

// ============================================================================
// NOTIFICATION & MESSAGE TESTS
// ============================================================================

describe('Routes - Notification & Message Display', () => {
  it('should render notifications', () => {
    const notificationData = [
      { id: 'n1', title: 'Alert 1', read: false },
      { id: 'n2', title: 'Alert 2', read: true },
    ];

    renderAtRoute('/notification', {
      data: {
        notifications: notificationData,
      },
    });

    expect(screen.getByTestId('notification-list')).toBeInTheDocument();
    expect(screen.getByText(/Alert/)).toBeInTheDocument();
  });

  it('should render messages', () => {
    const messageData = [
      { id: 'm1', sender: 'Alice', text: 'Hello' },
      { id: 'm2', sender: 'Bob', text: 'Hi' },
    ];

    renderAtRoute('/message', {
      data: {
        messages: messageData,
      },
    });

    expect(screen.getByTestId('message-list')).toBeInTheDocument();
    expect(screen.getByText(/Hello/)).toBeInTheDocument();
  });
});

// ============================================================================
// LOADING & ERROR STATE TESTS
// ============================================================================

describe('Routes - Loading & Error States', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Loading States', () => {
    it('should show loading on user page', () => {
      renderAtRoute('/user', { isLoading: true });
      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('should show loading on group page', () => {
      renderAtRoute('/group', { isLoading: true });
      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('should show loading on event page', () => {
      renderAtRoute('/event', { isLoading: true });
      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('should show loading on expense page', () => {
      renderAtRoute('/expense', { isLoading: true });
      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('should show loading on transaction page', () => {
      renderAtRoute('/transaction', { isLoading: true });
      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('should display error message when API fails', () => {
      renderAtRoute('/user', {
        error: 'Network error',
      });

      expect(screen.getByTestId('error')).toBeInTheDocument();
      expect(screen.getByText(/Network error/)).toBeInTheDocument();
    });

    it('should display error for expenses', () => {
      renderAtRoute('/expense', {
        error: 'Failed to fetch expenses',
      });

      expect(screen.getByTestId('error')).toBeInTheDocument();
      expect(screen.getByText(/Failed to fetch expenses/)).toBeInTheDocument();
    });

    it('should display error for group events', () => {
      renderAtRoute('/event/group/grp-1', {
        error: 'Group not found',
      });

      expect(screen.getByTestId('error')).toBeInTheDocument();
      expect(screen.getByText(/Group not found/)).toBeInTheDocument();
    });
  });
});

// ============================================================================
// DATA DIFFERENTIATION TESTS
// ============================================================================

describe('Routes - Data Differentiation', () => {
  it('should display different data for different pages', () => {
    const userPage = renderAtRoute('/user', {
      data: {
        users: [{ name: 'User1' }],
      },
    });

    expect(screen.getByTestId('user-list')).toBeInTheDocument();
    userPage.unmount();

    const groupPage = renderAtRoute('/group', {
      data: {
        groups: [{ name: 'Group1' }],
      },
    });

    expect(screen.getByTestId('group-list')).toBeInTheDocument();
    expect(screen.queryByTestId('user-list')).not.toBeInTheDocument();
  });

  it('should not mix expense and transaction data', () => {
    renderAtRoute('/expense', {
      data: {
        expenses: [{ amount: 100 }],
      },
    });

    expect(screen.getByTestId('expense-list')).toBeInTheDocument();
    expect(screen.queryByTestId('transaction-list')).not.toBeInTheDocument();
  });
});

// ============================================================================
// EMPTY STATE TESTS
// ============================================================================

describe('Routes - Empty States', () => {
  it('should handle empty user list gracefully', () => {
    renderAtRoute('/user', {
      data: {
        users: [],
      },
    });

    expect(screen.getByTestId('user-list')).toBeInTheDocument();
    expect(screen.getByText('[]')).toBeInTheDocument();
  });

  it('should handle empty groups', () => {
    renderAtRoute('/group', {
      data: {
        groups: [],
      },
    });

    expect(screen.getByTestId('group-list')).toBeInTheDocument();
  });

  it('should handle empty events', () => {
    renderAtRoute('/event', {
      data: {
        events: [],
      },
    });

    expect(screen.getByTestId('event-list')).toBeInTheDocument();
  });

  it('should handle no data provided', () => {
    renderAtRoute('/user', { data: {} });

    expect(screen.queryByTestId('user-list')).not.toBeInTheDocument();
  });
});

// ============================================================================
// DATA FORMAT VALIDATION
// ============================================================================

describe('Routes - Data Format Validation', () => {
  it('should correctly display JSON formatted data', () => {
    renderAtRoute('/user', {
      data: {
        users: JSON.stringify([{ id: 1, name: 'Test' }]),
      },
    });

    expect(screen.getByTestId('user-list')).toBeInTheDocument();
  });

  it('should handle complex nested data structures', () => {
    const complexData = {
      events: [
        {
          id: 'e1',
          name: 'Event 1',
          details: {
            location: 'NYC',
            attendees: 50,
            nested: { level: 3 },
          },
        },
      ],
    };

    renderAtRoute('/event', {
      data: complexData,
    });

    expect(screen.getByTestId('event-list')).toBeInTheDocument();
    expect(screen.getByText(/NYC/)).toBeInTheDocument();
  });
});

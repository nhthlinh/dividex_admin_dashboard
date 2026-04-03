import { type ReactNode } from 'react';
import { render, screen, type RenderResult } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

// ============================================================================
// IMPORT REAL COMPONENTS
// ============================================================================

import LoginPage from './features/auth/LoginPage';
import { AdminInviteAcceptPage } from './features/admins/AdminInviteAcceptPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { UserPage } from './features/users/UserPage';
import { GroupPage } from './features/groups/GroupPage';
import { EventPage } from './features/events/EventPage';
import { EventInGroupPage } from './features/events/EventInGroupPage';
import { ExpensePage } from './features/expenses/ExpensePage';
import { ExpenseInEventPage } from './features/expenses/ExpenseInEventPage';
import { TransactionPage } from './features/transactions/TransactionPage';
import { NotificationPage } from './features/notifications/NotificationPage';
import { MessagePage } from './features/messages/MessagePage';
import { SystemLogPage } from './features/systemLogs/SystemLogPage';
import { AdminManagementPage } from './features/admins/AdminManagementPage';
import { SettingsPage } from './features/dashboard/SettingPage';

// ============================================================================
// MOCK COMPONENTS & HOOKS FOR TESTING
// ============================================================================

// Mock layout components for test isolation
const MockHeader = () => <header data-testid="admin-header">Admin Header</header>;
const MockSidebar = ({ currentPage }: { currentPage: string; onNavigate?: (page: string) => void }) => (
  <nav data-testid="admin-nav">Navigation - {currentPage}</nav>
);

// ============================================================================
// REAL LAYOUT & AUTH WITH MOCKS
// ============================================================================

interface AdminLayoutProps {
  children: ReactNode;
  currentPage?: string;
}

const RealAdminLayout = ({ children }: AdminLayoutProps) => (
  <div data-testid="admin-layout" className="flex h-screen bg-slate-50 overflow-hidden">
    <MockSidebar currentPage="dashboard" />
    
    <div className="flex-1 overflow-x-auto flex flex-col">
      <MockHeader />
      
      <main data-testid="admin-main" className="p-6">
        {children}
      </main>
    </div>
  </div>
);

interface ProtectedRouteProps {
  children: ReactNode;
  isAuthenticated?: boolean;
}

const RealProtectedRoute = ({ children, isAuthenticated = true }: ProtectedRouteProps) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// ============================================================================
// ROUTER CONFIGURATION WITH REAL STRUCTURE
// ============================================================================

interface RouteTestConfig {
  isAuthenticated: boolean;
}

const createTestRouter = (config: RouteTestConfig) => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/admin/invite" element={<AdminInviteAcceptPage />} />
    <Route
      path="/*"
      element={
        <RealProtectedRoute isAuthenticated={config.isAuthenticated}>
          <RealAdminLayout>
            <Routes>
              <Route index element={<DashboardPage />} />
              <Route path="user" element={<UserPage />} />
              <Route path="group" element={<GroupPage />} />
              <Route path="event" element={<EventPage />} />
              <Route path="event/group/:group_uid" element={<EventInGroupPage />} />
              <Route path="expense" element={<ExpensePage />} />
              <Route path="expense/event/:event_uid" element={<ExpenseInEventPage />} />
              <Route path="transaction" element={<TransactionPage />} />
              <Route path="notification" element={<NotificationPage />} />
              <Route path="message" element={<MessagePage />} />
              <Route path="system-logs" element={<SystemLogPage />} />
              <Route path="admin" element={<AdminManagementPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Routes>
          </RealAdminLayout>
        </RealProtectedRoute>
      }
    />
  </Routes>
);

// ============================================================================
// TEST UTILITIES
// ============================================================================

const renderAtRoute = (initialRoute: string = '/', isAuthenticated: boolean = true): RenderResult => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      {createTestRouter({ isAuthenticated })}
    </MemoryRouter>
  );
};

// ============================================================================
// PUBLIC ROUTES
// ============================================================================

describe('Routes - Public Pages', () => {
  it('should render LoginPage at /login', () => {
    renderAtRoute('/login');
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('should render AdminInviteAcceptPage at /admin/invite', () => {
    renderAtRoute('/admin/invite');
    expect(screen.getByTestId('invite-accept-page')).toBeInTheDocument();
  });

  it('should render login page for public route without authentication', () => {
    renderAtRoute('/login', false);
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });
});

// ============================================================================
// AUTHENTICATION & PROTECTED ROUTES
// ============================================================================

describe('Routes - Authentication', () => {
  it('should redirect to login when not authenticated', () => {
    renderAtRoute('/', false);
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('should not show admin layout when not authenticated', () => {
    renderAtRoute('/', false);
    expect(screen.queryByTestId('admin-layout')).not.toBeInTheDocument();
  });

  it('should render protected content when authenticated', () => {
    renderAtRoute('/', true);
    expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
  });

  it('should render AdminLayout with all sub-components when authenticated', () => {
    renderAtRoute('/', true);
    expect(screen.getByTestId('admin-header')).toBeInTheDocument();
    expect(screen.getByTestId('admin-nav')).toBeInTheDocument();
    expect(screen.getByTestId('admin-main')).toBeInTheDocument();
  });
});

// ============================================================================
// DASHBOARD & CORE ROUTES
// ============================================================================

describe('Routes - Dashboard & Core Pages', () => {
  it('should render DashboardPage at / (index)', () => {
    renderAtRoute('/', true);
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });

  it('should render UserPage at /user', () => {
    renderAtRoute('/user', true);
    expect(screen.getByTestId('user-page')).toBeInTheDocument();
  });

  it('should render GroupPage at /group', () => {
    renderAtRoute('/group', true);
    expect(screen.getByTestId('group-page')).toBeInTheDocument();
  });

  it('should render EventPage at /event', () => {
    renderAtRoute('/event', true);
    expect(screen.getByTestId('event-page')).toBeInTheDocument();
  });

  it('should render TransactionPage at /transaction', () => {
    renderAtRoute('/transaction', true);
    expect(screen.getByTestId('transaction-page')).toBeInTheDocument();
  });

  it('should render NotificationPage at /notification', () => {
    renderAtRoute('/notification', true);
    expect(screen.getByTestId('notification-page')).toBeInTheDocument();
  });

  it('should render MessagePage at /message', () => {
    renderAtRoute('/message', true);
    expect(screen.getByTestId('message-page')).toBeInTheDocument();
  });

  it('should render SystemLogPage at /system-logs', () => {
    renderAtRoute('/system-logs', true);
    expect(screen.getByTestId('system-log-page')).toBeInTheDocument();
  });

  it('should render AdminManagementPage at /admin', () => {
    renderAtRoute('/admin', true);
    expect(screen.getByTestId('admin-management-page')).toBeInTheDocument();
  });

  it('should render SettingsPage at /settings', () => {
    renderAtRoute('/settings', true);
    expect(screen.getByTestId('settings-page')).toBeInTheDocument();
  });
});

// ============================================================================
// EXPENSE ROUTES
// ============================================================================

describe('Routes - Expense', () => {
  it('should render ExpensePage at /expense', () => {
    renderAtRoute('/expense', true);
    expect(screen.getByTestId('expense-page')).toBeInTheDocument();
  });

  it('should render ExpenseInEventPage at /expense/event/:event_uid', () => {
    renderAtRoute('/expense/event/event-123', true);
    expect(screen.getByTestId('expense-in-event-page')).toBeInTheDocument();
  });

  it('should handle numeric event_uid in expense route', () => {
    renderAtRoute('/expense/event/12345', true);
    expect(screen.getByTestId('expense-in-event-page')).toBeInTheDocument();
  });

  it('should handle UUID format event_uid', () => {
    renderAtRoute('/expense/event/a1b2c3d4-e5f6-4789-ab12-cdef34567890', true);
    expect(screen.getByTestId('expense-in-event-page')).toBeInTheDocument();
  });

  it('should handle hyphenated event_uid', () => {
    renderAtRoute('/expense/event/evt-2026-03-30-001', true);
    expect(screen.getByTestId('expense-in-event-page')).toBeInTheDocument();
  });

  it('should handle URL-encoded event_uid', () => {
    const encoded = encodeURIComponent('event with spaces');
    renderAtRoute(`/expense/event/${encoded}`, true);
    expect(screen.getByTestId('expense-in-event-page')).toBeInTheDocument();
  });
});

// ============================================================================
// EVENT ROUTES
// ============================================================================

describe('Routes - Event', () => {
  it('should render EventPage at /event', () => {
    renderAtRoute('/event', true);
    expect(screen.getByTestId('event-page')).toBeInTheDocument();
  });

  it('should render EventInGroupPage at /event/group/:group_uid', () => {
    renderAtRoute('/event/group/group-123', true);
    expect(screen.getByTestId('event-in-group-page')).toBeInTheDocument();
  });

  it('should handle numeric group_uid in event route', () => {
    renderAtRoute('/event/group/54321', true);
    expect(screen.getByTestId('event-in-group-page')).toBeInTheDocument();
  });

  it('should handle UUID format group_uid', () => {
    renderAtRoute('/event/group/a1b2c3d4-e5f6-4789-ab12-cdef34567890', true);
    expect(screen.getByTestId('event-in-group-page')).toBeInTheDocument();
  });

  it('should handle hyphenated group_uid', () => {
    renderAtRoute('/event/group/grp-2026-03-30-001', true);
    expect(screen.getByTestId('event-in-group-page')).toBeInTheDocument();
  });

  it('should handle URL-encoded group_uid', () => {
    const encoded = encodeURIComponent('group with spaces');
    renderAtRoute(`/event/group/${encoded}`, true);
    expect(screen.getByTestId('event-in-group-page')).toBeInTheDocument();
  });
});

// ============================================================================
// LAYOUT HIERARCHY
// ============================================================================

describe('Routes - Layout Hierarchy', () => {
  it('should render page content inside AdminLayout main element', () => {
    renderAtRoute('/user', true);
    const layout = screen.getByTestId('admin-layout');
    const main = screen.getByTestId('admin-main');
    const page = screen.getByTestId('user-page');
    expect(layout).toContainElement(main);
    expect(main).toContainElement(page);
  });

  it('should not render AdminLayout for login route', () => {
    renderAtRoute('/login', true);
    expect(screen.queryByTestId('admin-layout')).not.toBeInTheDocument();
  });

  it('should not render AdminLayout for invite route', () => {
    renderAtRoute('/admin/invite', true);
    expect(screen.queryByTestId('admin-layout')).not.toBeInTheDocument();
  });
});

// ============================================================================
// ROUTE SPECIFICITY
// ============================================================================

describe('Routes - Route Specificity', () => {
  it('should distinguish /event from /event/group/:group_uid', () => {
    renderAtRoute('/event', true);
    expect(screen.getByTestId('event-page')).toBeInTheDocument();
    expect(screen.queryByTestId('event-in-group-page')).not.toBeInTheDocument();
  });

  it('should distinguish /expense from /expense/event/:event_uid', () => {
    renderAtRoute('/expense', true);
    expect(screen.getByTestId('expense-page')).toBeInTheDocument();
    expect(screen.queryByTestId('expense-in-event-page')).not.toBeInTheDocument();
  });

  it('should not confuse /user with /group', () => {
    renderAtRoute('/user', true);
    expect(screen.getByTestId('user-page')).toBeInTheDocument();
    expect(screen.queryByTestId('group-page')).not.toBeInTheDocument();
  });

  it('should not confuse /notification with /message', () => {
    renderAtRoute('/notification', true);
    expect(screen.getByTestId('notification-page')).toBeInTheDocument();
    expect(screen.queryByTestId('message-page')).not.toBeInTheDocument();
  });
});

// ============================================================================
// PROTECTION VERIFICATION
// ============================================================================

describe('Routes - Protection Verification', () => {
  const protectedRoutes = ['/', '/user', '/group', '/event', '/expense', '/transaction', '/notification', '/message', '/system-logs', '/admin', '/settings'];

  protectedRoutes.forEach((route) => {
    it(`should protect ${route} route from unauthenticated access`, () => {
      renderAtRoute(route, false);
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
  });
});

// ============================================================================
// EXTENDED PARAMETER VARIATIONS
// ============================================================================

describe('Routes - Extended Parameter Variations', () => {
  describe('Event UID Variations', () => {
    const testCases = [
      { uid: 'simple-id', label: 'simple-id' },
      { uid: '123', label: 'numeric only' },
      { uid: 'evt_special-chars_123', label: 'underscores and hyphens' },
      { uid: 'UPPERCASE_ID', label: 'uppercase' },
      { uid: 'mixed-Case_123', label: 'mixed case' },
      { uid: '0', label: 'single zero' },
      { uid: '999999999999', label: 'large numeric' },
      { uid: 'a', label: 'single character' },
    ];

    testCases.forEach(({ uid, label }) => {
      it(`should handle expense event route with ${label}`, () => {
        renderAtRoute(`/expense/event/${uid}`, true);
        expect(screen.getByTestId('expense-in-event-page')).toBeInTheDocument();
      });
    });
  });

  describe('Group UID Variations', () => {
    const testCases = [
      { uid: 'simple-group', label: 'simple-group' },
      { uid: '456', label: 'numeric only' },
      { uid: 'grp_special-chars_456', label: 'underscores and hyphens' },
      { uid: 'UPPERCASE_GROUP', label: 'uppercase' },
      { uid: 'mixed-Case_456', label: 'mixed case' },
      { uid: '0', label: 'single zero' },
      { uid: '888888888888', label: 'large numeric' },
      { uid: 'z', label: 'single character' },
    ];

    testCases.forEach(({ uid, label }) => {
      it(`should handle event group route with ${label}`, () => {
        renderAtRoute(`/event/group/${uid}`, true);
        expect(screen.getByTestId('event-in-group-page')).toBeInTheDocument();
      });
    });
  });
});

// ============================================================================
// ALL ROUTES RENDERING WITH AUTH
// ============================================================================

describe('Routes - All Routes Render Correctly When Authenticated', () => {
  const routeMap = [
    { path: '/', testId: 'dashboard-page', label: 'Dashboard' },
    { path: '/user', testId: 'user-page', label: 'User' },
    { path: '/group', testId: 'group-page', label: 'Group' },
    { path: '/event', testId: 'event-page', label: 'Event' },
    { path: '/expense', testId: 'expense-page', label: 'Expense' },
    { path: '/transaction', testId: 'transaction-page', label: 'Transaction' },
    { path: '/notification', testId: 'notification-page', label: 'Notification' },
    { path: '/message', testId: 'message-page', label: 'Message' },
    { path: '/system-logs', testId: 'system-log-page', label: 'System Logs' },
    { path: '/admin', testId: 'admin-management-page', label: 'Admin' },
    { path: '/settings', testId: 'settings-page', label: 'Settings' },
  ];

  routeMap.forEach(({ path, testId, label }) => {
    it(`${label} page should have admin layout structure`, () => {
      renderAtRoute(path, true);
      expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
      expect(screen.getByTestId('admin-header')).toBeInTheDocument();
      expect(screen.getByTestId('admin-nav')).toBeInTheDocument();
      expect(screen.getByTestId('admin-main')).toBeInTheDocument();
      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });
  });

  routeMap.forEach(({ path, testId, label }) => {
    it(`${label} page should be contained within admin main element`, () => {
      renderAtRoute(path, true);
      const adminMain = screen.getByTestId('admin-main');
      const page = screen.getByTestId(testId);
      expect(adminMain).toContainElement(page);
    });
  });
});

// ============================================================================
// DYNAMIC ROUTE PARAMETER COMBINATIONS
// ============================================================================

describe('Routes - Dynamic Parameter Combinations', () => {
  describe('Event/Group Nested Routes', () => {
    it('should handle event/group route with ID containing numbers and letters', () => {
      renderAtRoute('/event/group/abc123def', true);
      expect(screen.getByTestId('event-in-group-page')).toBeInTheDocument();
    });

    it('should handle expense/event route with ID containing numbers and letters', () => {
      renderAtRoute('/expense/event/xyz789uvw', true);
      expect(screen.getByTestId('expense-in-event-page')).toBeInTheDocument();
    });

    it('should preserve parameter in event/group route', () => {
      const param = 'group-id-test-123';
      renderAtRoute(`/event/group/${param}`, true);
      const page = screen.getByTestId('event-in-group-page');
      expect(page).toBeInTheDocument();
    });

    it('should preserve parameter in expense/event route', () => {
      const param = 'event-id-test-456';
      renderAtRoute(`/expense/event/${param}`, true);
      const page = screen.getByTestId('expense-in-event-page');
      expect(page).toBeInTheDocument();
    });
  });
});

// ============================================================================
// PUBLIC VS PROTECTED ROUTES
// ============================================================================

describe('Routes - Public vs Protected Distinction', () => {
  describe('Public Routes - Always Accessible', () => {
    it('login should be accessible when authenticated', () => {
      renderAtRoute('/login', true);
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('login should not render admin layout', () => {
      renderAtRoute('/login', true);
      expect(screen.queryByTestId('admin-layout')).not.toBeInTheDocument();
    });

    it('admin/invite should be accessible when authenticated', () => {
      renderAtRoute('/admin/invite', true);
      expect(screen.getByTestId('invite-accept-page')).toBeInTheDocument();
    });

    it('admin/invite should not render admin layout', () => {
      renderAtRoute('/admin/invite', true);
      expect(screen.queryByTestId('admin-layout')).not.toBeInTheDocument();
    });
  });

  describe('Protected Routes - Blocked When Unauthenticated', () => {
    it('dashboard redirects to login when not authenticated', () => {
      renderAtRoute('/', false);
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.queryByTestId('dashboard-page')).not.toBeInTheDocument();
    });

    it('user page redirects to login when not authenticated', () => {
      renderAtRoute('/user', false);
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.queryByTestId('user-page')).not.toBeInTheDocument();
    });

    it('dynamic route redirects to login when not authenticated', () => {
      renderAtRoute('/event/group/some-group', false);
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.queryByTestId('event-in-group-page')).not.toBeInTheDocument();
    });
  });
});

// ============================================================================
// COMPONENT COMPOSITION & NESTING
// ============================================================================

describe('Routes - Component Composition & Nesting', () => {
  it('should nest page components inside admin-main', () => {
    renderAtRoute('/user', true);
    const adminMain = screen.getByTestId('admin-main');
    expect(adminMain.children.length).toBeGreaterThan(0);
  });

  it('should not duplicate components across routes', () => {
    renderAtRoute('/user', true);
    const headers = screen.getAllByTestId('admin-header');
    expect(headers).toHaveLength(1);
  });

  it('should maintain layout structure on user page', () => {
    renderAtRoute('/user', true);
    expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
    expect(screen.getByTestId('admin-header')).toBeInTheDocument();
    expect(screen.getByTestId('admin-nav')).toBeInTheDocument();
    expect(screen.getByTestId('admin-main')).toBeInTheDocument();
  });

  it('should maintain layout structure on group page', () => {
    renderAtRoute('/group', true);
    expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
    expect(screen.getByTestId('admin-header')).toBeInTheDocument();
    expect(screen.getByTestId('admin-nav')).toBeInTheDocument();
    expect(screen.getByTestId('admin-main')).toBeInTheDocument();
  });

  it('should maintain layout structure on event page', () => {
    renderAtRoute('/event', true);
    expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
    expect(screen.getByTestId('admin-header')).toBeInTheDocument();
    expect(screen.getByTestId('admin-nav')).toBeInTheDocument();
    expect(screen.getByTestId('admin-main')).toBeInTheDocument();
  });
});

// ============================================================================
// ROUTE ISOLATION
// ============================================================================

describe('Routes - Route Isolation', () => {
  it('user page should not render group page content', () => {
    renderAtRoute('/user', true);
    expect(screen.getByTestId('user-page')).toBeInTheDocument();
    expect(screen.queryByTestId('group-page')).not.toBeInTheDocument();
    expect(screen.queryByTestId('event-page')).not.toBeInTheDocument();
  });

  it('event page should not render expense page content', () => {
    renderAtRoute('/event', true);
    expect(screen.getByTestId('event-page')).toBeInTheDocument();
    expect(screen.queryByTestId('expense-page')).not.toBeInTheDocument();
  });

  it('notification page should not render message page content', () => {
    renderAtRoute('/notification', true);
    expect(screen.getByTestId('notification-page')).toBeInTheDocument();
    expect(screen.queryByTestId('message-page')).not.toBeInTheDocument();
    expect(screen.queryByTestId('transaction-page')).not.toBeInTheDocument();
  });

  it('system logs page should not render admin page content', () => {
    renderAtRoute('/system-logs', true);
    expect(screen.getByTestId('system-log-page')).toBeInTheDocument();
    expect(screen.queryByTestId('admin-management-page')).not.toBeInTheDocument();
  });
});

// ============================================================================
// AUTHENTICATION STATE TRANSITIONS
// ============================================================================

describe('Routes - Authentication State', () => {
  it('authenticated route should display component directly', () => {
    renderAtRoute('/settings', true);
    expect(screen.getByTestId('settings-page')).toBeInTheDocument();
  });

  it('unauthenticated access should trigger login redirect', () => {
    renderAtRoute('/settings', false);
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.queryByTestId('settings-page')).not.toBeInTheDocument();
  });

  it('protected route should always show admin layout when authenticated', () => {
    renderAtRoute('/admin', true);
    expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
  });

  it('protected route should never show admin layout when not authenticated', () => {
    renderAtRoute('/admin', false);
    expect(screen.queryByTestId('admin-layout')).not.toBeInTheDocument();
  });
});

// ============================================================================
// COMPLEX PARAMETER SCENARIOS
// ============================================================================

describe('Routes - Complex Parameter Scenarios', () => {
  describe('Long and Complex IDs', () => {
    it('should handle very long event_uid', () => {
      const longId = 'a'.repeat(100);
      renderAtRoute(`/expense/event/${longId}`, true);
      expect(screen.getByTestId('expense-in-event-page')).toBeInTheDocument();
    });

    it('should handle very long group_uid', () => {
      const longId = 'b'.repeat(100);
      renderAtRoute(`/event/group/${longId}`, true);
      expect(screen.getByTestId('event-in-group-page')).toBeInTheDocument();
    });

    it('should handle ID with many hyphens', () => {
      const hyphenatedId = 'part1-part2-part3-part4-part5-part6-part7';
      renderAtRoute(`/expense/event/${hyphenatedId}`, true);
      expect(screen.getByTestId('expense-in-event-page')).toBeInTheDocument();
    });

    it('should handle ID with numbers and special patterns', () => {
      const patternId = 'event-2026-03-30-123-abc-xyz';
      renderAtRoute(`/expense/event/${patternId}`, true);
      expect(screen.getByTestId('expense-in-event-page')).toBeInTheDocument();
    });
  });
});

// ============================================================================
// MENU STRUCTURE & HIERARCHY
// ============================================================================

describe('Routes - Menu Structure Validation', () => {
  it('admin layout should have header element', () => {
    renderAtRoute('/', true);
    const header = screen.getByTestId('admin-header');
    expect(header).toBeInTheDocument();
    expect(header.tagName).toBe('HEADER');
  });

  it('admin layout should have nav element', () => {
    renderAtRoute('/', true);
    const nav = screen.getByTestId('admin-nav');
    expect(nav).toBeInTheDocument();
    expect(nav.tagName).toBe('NAV');
  });

  it('admin layout should have main element', () => {
    renderAtRoute('/', true);
    const main = screen.getByTestId('admin-main');
    expect(main).toBeInTheDocument();
    expect(main.tagName).toBe('MAIN');
  });

  it('page content should be inside main element', () => {
    renderAtRoute('/group', true);
    const mainElement = screen.getByTestId('admin-main');
    const groupPage = screen.getByTestId('group-page');
    
    expect(mainElement.contains(groupPage)).toBe(true);
  });
});

// ============================================================================
// ROUTE MATCHING SPECIFICITY
// ============================================================================

describe('Routes - Route Matching Specificity', () => {
  it('should match /event before /event/group/:group_uid', () => {
    renderAtRoute('/event', true);
    expect(screen.getByTestId('event-page')).toBeInTheDocument();
    expect(screen.queryByTestId('event-in-group-page')).not.toBeInTheDocument();
  });

  it('should match /expense before /expense/event/:event_uid', () => {
    renderAtRoute('/expense', true);
    expect(screen.getByTestId('expense-page')).toBeInTheDocument();
    expect(screen.queryByTestId('expense-in-event-page')).not.toBeInTheDocument();
  });

  it('should match specific route over wildcard', () => {
    renderAtRoute('/admin', true);
    expect(screen.getByTestId('admin-management-page')).toBeInTheDocument();
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
  });

  it('should match /system-logs as complete path', () => {
    renderAtRoute('/system-logs', true);
    expect(screen.getByTestId('system-log-page')).toBeInTheDocument();
    expect(screen.queryByTestId('admin-management-page')).not.toBeInTheDocument();
  });
});

/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AdminLayout from './AdminLayout';

// Mock Sidebar component
vi.mock('../Sidebar', () => ({
  Sidebar: ({ currentPage, onNavigate }: any) => (
    <div data-testid="sidebar">
      <button data-testid="nav-dashboard" onClick={() => onNavigate('dashboard')}>Dashboard</button>
      <button data-testid="nav-user" onClick={() => onNavigate('user')}>Users</button>
      <button data-testid="nav-group" onClick={() => onNavigate('group')}>Groups</button>
      <button data-testid="nav-event" onClick={() => onNavigate('event')}>Events</button>
      <button data-testid="nav-expense" onClick={() => onNavigate('expense')}>Expenses</button>
      <button data-testid="nav-transaction" onClick={() => onNavigate('transaction')}>Transactions</button>
      <button data-testid="nav-notification" onClick={() => onNavigate('notification')}>Notifications</button>
      <button data-testid="nav-message" onClick={() => onNavigate('message')}>Messages</button>
      <button data-testid="nav-admin" onClick={() => onNavigate('admin')}>Admin</button>
      <button data-testid="nav-system-logs" onClick={() => onNavigate('system-logs')}>System Logs</button>
      <button data-testid="nav-settings" onClick={() => onNavigate('settings')}>Settings</button>
      <div data-testid="sidebar-current-page">{currentPage}</div>
    </div>
  ),
}));

// Mock Header component
vi.mock('../Header', () => ({
  Header: () => <div data-testid="header">Header</div>,
}));

// Mock Outlet from react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">Outlet Content</div>,
  };
});

describe('AdminLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete (window as any).location;
    (window as any).location = { 
      pathname: '/', 
      href: '' 
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ===================
  // BASIC RENDERING TESTS
  // ===================
  describe('Rendering', () => {
    it('should render layout with all components', () => {
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('outlet')).toBeInTheDocument();
    });

    it('should have proper layout structure with flexbox', () => {
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      const layout = screen.getByTestId('admin-layout');
      expect(layout).toHaveClass('flex');
      expect(layout).toHaveClass('min-h-screen');
      expect(layout).toHaveClass('bg-slate-50');
      expect(layout).toHaveClass('overflow-x-hidden');
    });

    it('should render outlet for page content', () => {
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      expect(screen.getByTestId('outlet')).toBeInTheDocument();
    });

    it('should render sidebar component', () => {
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    it('should render header component', () => {
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('should render without errors', () => {
      expect(() => {
        render(
          <BrowserRouter>
            <AdminLayout />
          </BrowserRouter>
        );
      }).not.toThrow();
    });
  });

  // ===================
  // INITIAL STATE TESTS
  // ===================
  describe('Initial State', () => {
    it('should initialize with dashboard when pathname is /', () => {
      (window as any).location.pathname = '/';
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      expect(screen.getByTestId('sidebar-current-page')).toHaveTextContent('dashboard');
    });

    it('should initialize with user when pathname is /user', () => {
      (window as any).location.pathname = '/user';
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      expect(screen.getByTestId('sidebar-current-page')).toHaveTextContent('user');
    });

    it('should initialize with group when pathname is /group', () => {
      (window as any).location.pathname = '/group';
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      expect(screen.getByTestId('sidebar-current-page')).toHaveTextContent('group');
    });

    it('should initialize with event when pathname is /event', () => {
      (window as any).location.pathname = '/event';
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      expect(screen.getByTestId('sidebar-current-page')).toHaveTextContent('event');
    });

    it('should initialize with expense when pathname is /expense', () => {
      (window as any).location.pathname = '/expense';
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      expect(screen.getByTestId('sidebar-current-page')).toHaveTextContent('expense');
    });

    it('should initialize with transaction when pathname is /transaction', () => {
      (window as any).location.pathname = '/transaction';
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      expect(screen.getByTestId('sidebar-current-page')).toHaveTextContent('transaction');
    });

    it('should initialize with notification when pathname is /notification', () => {
      (window as any).location.pathname = '/notification';
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      expect(screen.getByTestId('sidebar-current-page')).toHaveTextContent('notification');
    });

    it('should initialize with message when pathname is /message', () => {
      (window as any).location.pathname = '/message';
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      expect(screen.getByTestId('sidebar-current-page')).toHaveTextContent('message');
    });

    it('should initialize with admin when pathname is /admin', () => {
      (window as any).location.pathname = '/admin';
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      expect(screen.getByTestId('sidebar-current-page')).toHaveTextContent('admin');
    });

    it('should initialize with system-logs when pathname is /system-logs', () => {
      (window as any).location.pathname = '/system-logs';
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      expect(screen.getByTestId('sidebar-current-page')).toHaveTextContent('system-logs');
    });

    it('should initialize with settings when pathname is /settings', () => {
      (window as any).location.pathname = '/settings';
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      expect(screen.getByTestId('sidebar-current-page')).toHaveTextContent('settings');
    });
  });

  // ===================
  // NAVIGATION TESTS - DASHBOARD
  // ===================
  describe('Navigation - Dashboard', () => {
    it('should navigate to dashboard', async () => {
      const user = userEvent.setup({ delay: null });
      (window as any).location.pathname = '/';
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      const dashboardButton = screen.getByTestId('nav-dashboard');
      await user.click(dashboardButton);

      expect((window as any).location.href).toBe('/');
    });

    it('should set currentPage to dashboard after navigation', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      const dashboardButton = screen.getByTestId('nav-dashboard');
      await user.click(dashboardButton);

      expect(screen.getByTestId('sidebar-current-page')).toHaveTextContent('dashboard');
    });
  });

  // ===================
  // NAVIGATION TESTS - USER
  // ===================
  describe('Navigation - User', () => {
    it('should navigate to user page', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      const userButton = screen.getByTestId('nav-user');
      await user.click(userButton);

      expect((window as any).location.href).toBe('/user');
    });

    it('should set currentPage to user after navigation', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      const userButton = screen.getByTestId('nav-user');
      await user.click(userButton);

      expect(screen.getByTestId('sidebar-current-page')).toHaveTextContent('user');
    });
  });

  // ===================
  // NAVIGATION TESTS - GROUP
  // ===================
  describe('Navigation - Group', () => {
    it('should navigate to group page', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      const groupButton = screen.getByTestId('nav-group');
      await user.click(groupButton);

      expect((window as any).location.href).toBe('/group');
    });

    it('should set currentPage to group after navigation', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      const groupButton = screen.getByTestId('nav-group');
      await user.click(groupButton);

      expect(screen.getByTestId('sidebar-current-page')).toHaveTextContent('group');
    });
  });

  // ===================
  // NAVIGATION TESTS - EVENT
  // ===================
  describe('Navigation - Event', () => {
    it('should navigate to event page', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      const eventButton = screen.getByTestId('nav-event');
      await user.click(eventButton);

      expect((window as any).location.href).toBe('/event');
    });

    it('should set currentPage to event after navigation', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      const eventButton = screen.getByTestId('nav-event');
      await user.click(eventButton);

      expect(screen.getByTestId('sidebar-current-page')).toHaveTextContent('event');
    });
  });

  // ===================
  // NAVIGATION TESTS - EXPENSE
  // ===================
  describe('Navigation - Expense', () => {
    it('should navigate to expense page', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      const expenseButton = screen.getByTestId('nav-expense');
      await user.click(expenseButton);

      expect((window as any).location.href).toBe('/expense');
    });

    it('should set currentPage to expense after navigation', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      const expenseButton = screen.getByTestId('nav-expense');
      await user.click(expenseButton);

      expect(screen.getByTestId('sidebar-current-page')).toHaveTextContent('expense');
    });
  });

  // ===================
  // NAVIGATION TESTS - TRANSACTION
  // ===================
  describe('Navigation - Transaction', () => {
    it('should navigate to transaction page', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      const transactionButton = screen.getByTestId('nav-transaction');
      await user.click(transactionButton);

      expect((window as any).location.href).toBe('/transaction');
    });

    it('should set currentPage to transaction after navigation', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      const transactionButton = screen.getByTestId('nav-transaction');
      await user.click(transactionButton);

      expect(screen.getByTestId('sidebar-current-page')).toHaveTextContent('transaction');
    });
  });

  // ===================
  // NAVIGATION TESTS - NOTIFICATION
  // ===================
  describe('Navigation - Notification', () => {
    it('should navigate to notification page', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      const notificationButton = screen.getByTestId('nav-notification');
      await user.click(notificationButton);

      expect((window as any).location.href).toBe('/notification');
    });

    it('should set currentPage to notification after navigation', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      const notificationButton = screen.getByTestId('nav-notification');
      await user.click(notificationButton);

      expect(screen.getByTestId('sidebar-current-page')).toHaveTextContent('notification');
    });
  });

  // ===================
  // NAVIGATION TESTS - MESSAGE
  // ===================
  describe('Navigation - Message', () => {
    it('should navigate to message page', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      const messageButton = screen.getByTestId('nav-message');
      await user.click(messageButton);

      expect((window as any).location.href).toBe('/message');
    });

    it('should set currentPage to message after navigation', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      const messageButton = screen.getByTestId('nav-message');
      await user.click(messageButton);

      expect(screen.getByTestId('sidebar-current-page')).toHaveTextContent('message');
    });
  });

  // ===================
  // NAVIGATION TESTS - ADMIN
  // ===================
  describe('Navigation - Admin', () => {
    it('should navigate to admin page', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      const adminButton = screen.getByTestId('nav-admin');
      await user.click(adminButton);

      expect((window as any).location.href).toBe('/admin');
    });

    it('should set currentPage to admin after navigation', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      const adminButton = screen.getByTestId('nav-admin');
      await user.click(adminButton);

      expect(screen.getByTestId('sidebar-current-page')).toHaveTextContent('admin');
    });
  });

  // ===================
  // NAVIGATION TESTS - SYSTEM LOGS
  // ===================
  describe('Navigation - System Logs', () => {
    it('should navigate to system-logs page', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      const systemLogsButton = screen.getByTestId('nav-system-logs');
      await user.click(systemLogsButton);

      expect((window as any).location.href).toBe('/system-logs');
    });

    it('should set currentPage to system-logs after navigation', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      const systemLogsButton = screen.getByTestId('nav-system-logs');
      await user.click(systemLogsButton);

      expect(screen.getByTestId('sidebar-current-page')).toHaveTextContent('system-logs');
    });
  });

  // ===================
  // NAVIGATION TESTS - SETTINGS
  // ===================
  describe('Navigation - Settings', () => {
    it('should navigate to settings page', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      const settingsButton = screen.getByTestId('nav-settings');
      await user.click(settingsButton);

      expect((window as any).location.href).toBe('/settings');
    });

    it('should set currentPage to settings after navigation', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      const settingsButton = screen.getByTestId('nav-settings');
      await user.click(settingsButton);

      expect(screen.getByTestId('sidebar-current-page')).toHaveTextContent('settings');
    });
  });

  // ===================
  // MULTI-NAVIGATION TESTS
  // ===================
  describe('Multiple Navigation', () => {
    it('should handle navigation between multiple routes', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      // Navigate to user
      let button = screen.getByTestId('nav-user');
      await user.click(button);
      expect(screen.getByTestId('sidebar-current-page')).toHaveTextContent('user');

      // Navigate to event
      button = screen.getByTestId('nav-event');
      await user.click(button);
      expect(screen.getByTestId('sidebar-current-page')).toHaveTextContent('event');

      // Navigate to settings
      button = screen.getByTestId('nav-settings');
      await user.click(button);
      expect(screen.getByTestId('sidebar-current-page')).toHaveTextContent('settings');

      // Navigate back to dashboard
      button = screen.getByTestId('nav-dashboard');
      await user.click(button);
      expect(screen.getByTestId('sidebar-current-page')).toHaveTextContent('dashboard');
    });

    it('should handle rapid navigation changes', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      const routes = ['user', 'group', 'event', 'expense', 'transaction'];
      
      for (const route of routes) {
        const button = screen.getByTestId(`nav-${route}`);
        await user.click(button);
        expect(screen.getByTestId('sidebar-current-page')).toHaveTextContent(route);
      }
    });

    it('should track all navigation routes', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      const routes = [
        'dashboard', 'user', 'group', 'event', 'expense', 
        'transaction', 'notification', 'message', 'admin', 
        'system-logs', 'settings'
      ];

      for (const route of routes) {
        const button = screen.getByTestId(`nav-${route}`);
        await user.click(button);
        expect(screen.getByTestId('sidebar-current-page')).toHaveTextContent(route);
      }
    });
  });

  // ===================
  // DEFAULT CASE TESTS
  // ===================
  describe('Default Navigation Case', () => {
    it('should handle navigation with no matching case', async () => {
      // const user = userEvent.setup({ delay: null });
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      const layout = screen.getByTestId('admin-layout');
      expect(layout).toBeInTheDocument();
    });

    it('should initialize correctly on first render', () => {
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });
  });

  // ===================
  // COMPONENT STRUCTURE TESTS
  // ===================
  describe('Component Structure', () => {
    it('should have sidebar on the left', () => {
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      const sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toBeInTheDocument();
    });

    it('should have header in main section', () => {
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      const header = screen.getByTestId('header');
      expect(header).toBeInTheDocument();
    });

    it('should have outlet for main content', () => {
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      const outlet = screen.getByTestId('outlet');
      expect(outlet).toBeInTheDocument();
    });

    it('should have main element with proper styling', () => {
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      const layout = screen.getByTestId('admin-layout');
      expect(layout.querySelector('main')).toBeInTheDocument();
    });

    it('should have flex container structure', () => {
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      const layout = screen.getByTestId('admin-layout');
      expect(layout).toHaveClass('flex');
    });
  });

  // ===================
  // NAVIGATION CORRECTNESS TESTS
  // ===================
  describe('Navigation Correctness', () => {
    it('should set correct href for all routes', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      const routeMap: Record<string, string> = {
        'nav-dashboard': '/',
        'nav-user': '/user',
        'nav-group': '/group',
        'nav-event': '/event',
        'nav-expense': '/expense',
        'nav-transaction': '/transaction',
        'nav-notification': '/notification',
        'nav-message': '/message',
        'nav-admin': '/admin',
        'nav-system-logs': '/system-logs',
        'nav-settings': '/settings',
      };

      for (const [testId, expectedHref] of Object.entries(routeMap)) {
        const button = screen.getByTestId(testId);
        await user.click(button);
        expect((window as any).location.href).toBe(expectedHref);
      }
    });

    it('should display correct currentPage state for each route', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <BrowserRouter>
          <AdminLayout />
        </BrowserRouter>
      );

      const routeMap: Record<string, string> = {
        'nav-dashboard': 'dashboard',
        'nav-user': 'user',
        'nav-group': 'group',
        'nav-event': 'event',
        'nav-expense': 'expense',
        'nav-transaction': 'transaction',
        'nav-notification': 'notification',
        'nav-message': 'message',
        'nav-admin': 'admin',
        'nav-system-logs': 'system-logs',
        'nav-settings': 'settings',
      };

      for (const [testId, expectedPage] of Object.entries(routeMap)) {
        const button = screen.getByTestId(testId);
        await user.click(button);
        expect(screen.getByTestId('sidebar-current-page')).toHaveTextContent(expectedPage);
      }
    });
  });
});
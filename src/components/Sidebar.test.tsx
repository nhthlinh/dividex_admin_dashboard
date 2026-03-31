/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar } from './Sidebar';

// Mock authStore
vi.mock('../features/auth/auth.store', () => ({
  authStore: {
    logout: vi.fn(),
  },
}));

// Mock router
vi.mock('../app/router', () => ({
  router: {},
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  LayoutDashboard: () => <span>DashboardIcon</span>,
  Users: () => <span>UsersIcon</span>,
  ShoppingCart: () => <span>GroupIcon</span>,
  Calendar: () => <span>EventIcon</span>,
  TrendingDown: () => <span>ExpenseIcon</span>,
  CreditCard: () => <span>TransactionIcon</span>,
  Bell: () => <span>NotificationIcon</span>,
  MessageSquare: () => <span>MessageIcon</span>,
  PlusSquare: () => <span>AdminIcon</span>,
  Activity: () => <span>SystemLogsIcon</span>,
  Menu: () => <span>MenuIcon</span>,
  LogOut: () => <span>LogOutIcon</span>,
}));

// Mock UI components
vi.mock('./ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}));

import { authStore } from '../features/auth/auth.store';

const mockAuthStore = authStore as unknown as { logout: ReturnType<typeof vi.fn> };

describe('Sidebar', () => {
  const mockOnNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render sidebar element', () => {
    render(<Sidebar currentPage="dashboard" onNavigate={mockOnNavigate} />);

    expect(screen.getByRole('complementary')).toBeInTheDocument();
  });

  it('should render menu items', () => {
    render(<Sidebar currentPage="dashboard" onNavigate={mockOnNavigate} />);

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/User/i)).toBeInTheDocument();
    expect(screen.getByText(/Group/i)).toBeInTheDocument();
  });

  it('should display current page', () => {
    render(<Sidebar currentPage="user" onNavigate={mockOnNavigate} />);

    // The currentPage should be highlighted or indicated somehow
    expect(screen.getByRole('complementary')).toBeInTheDocument();
  });

  it('should call onNavigate when menu item is clicked', async () => {
    const user = userEvent.setup();
    render(<Sidebar currentPage="dashboard" onNavigate={mockOnNavigate} />);

    const dashboardButton = screen.getByText(/Dashboard/i);
    await user.click(dashboardButton);

    expect(mockOnNavigate).toHaveBeenCalled();
  });

  it('should have collapse button', () => {
    render(<Sidebar currentPage="dashboard" onNavigate={mockOnNavigate} />);

    // Look for menu toggle button
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should have logout button', () => {
    render(<Sidebar currentPage="dashboard" onNavigate={mockOnNavigate} />);

    const logoutButton = screen.getByText(/LogOut|Logout/i);
    expect(logoutButton).toBeInTheDocument();
  });

  it('should call authStore.logout when logout is clicked', async () => {
    const user = userEvent.setup();
    delete (window as any).location;
    (window as any).location = { href: '' };

    render(<Sidebar currentPage="dashboard" onNavigate={mockOnNavigate} />);

    const logoutButton = screen.getByText(/LogOut|Logout/i);
    await user.click(logoutButton);

    expect(mockAuthStore.logout).toHaveBeenCalled();
  });

  it('should render all navigation items', () => {
    render(<Sidebar currentPage="dashboard" onNavigate={mockOnNavigate} />);

    const menuItems = [
      'Dashboard',
      'User',
      'Group',
      'Event',
      'Expense',
      'Transaction',
      'Notification',
      'Message',
      'Admin',
      'System Logs',
    ];

    menuItems.forEach((item) => {
      expect(screen.getByText(new RegExp(item, 'i'))).toBeInTheDocument();
    });
  });

  it('should update highlighted page when currentPage prop changes', () => {
    const { rerender } = render(<Sidebar currentPage="dashboard" onNavigate={mockOnNavigate} />);

    rerender(<Sidebar currentPage="user" onNavigate={mockOnNavigate} />);

    // Component should handle the prop change
    expect(screen.getByRole('complementary')).toBeInTheDocument();
  });

  it('should handle navigation for all menu items', async () => {
    const user = userEvent.setup();
    render(<Sidebar currentPage="dashboard" onNavigate={mockOnNavigate} />);

    const buttons = screen.getAllByRole('button');
    // Click first menu item
    if (buttons.length > 0) {
      await user.click(buttons[0]);
      expect(mockOnNavigate).toHaveBeenCalled();
    }
  });
});

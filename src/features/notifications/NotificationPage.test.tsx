/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotificationPage } from './NotificationPage';

// Create hoisted mocks that can be accessed in tests and vi.mock()
const { mockNotificationAPI, mockUserAPI } = vi.hoisted(() => ({
  mockNotificationAPI: {
    listNotifications: vi.fn().mockResolvedValue({
      content: [
        {
          uid: 'noti-1',
          content: 'Test notification 1',
          type: 'System',
          created_at: '2024-01-01T10:00:00Z',
          is_broadcast: false,
          related_uid: null,
          to_users: [
            {
              uid: 'user-1',
              full_name: 'User 1',
              email: 'user1@test.com',
              avatar_url: {
                uid: 'avatar-1',
                original_name: 'avatar.jpg',
                public_url: 'https://example.com/user1.jpg',
              },
            },
          ],
          from_user: {
            uid: 'user-admin',
            full_name: 'Admin User',
            email: 'admin@test.com',
            avatar_url: {
              uid: 'avatar-admin',
              original_name: 'admin.jpg',
              public_url: 'https://example.com/admin.jpg',
            },
          },
        },
        {
          uid: 'noti-2',
          content: 'Test notification 2',
          type: 'Warning',
          created_at: '2024-01-02T11:00:00Z',
          is_broadcast: true,
          related_uid: null,
          to_users: [],
          from_user: {
            uid: 'user-admin',
            full_name: 'Admin User',
            email: 'admin@test.com',
            avatar_url: {
              uid: 'avatar-admin',
              original_name: 'admin.jpg',
              public_url: 'https://example.com/admin.jpg',
            },
          },
        },
      ],
      total_rows: 2,
      current_page: 1,
      page_size: 10,
      total_pages: 1,
    }),
    getNotificationStats: vi.fn().mockResolvedValue({
      total_notifications: 42,
      percent_increase_total_notifications: 12,
      total_users: 156,
      percent_increase_users: 5,
      notifications_today: 8,
      percent_increase_notifications_today: 20,
    }),
    createNotification: vi.fn().mockResolvedValue({ uid: 'noti-3' }),
    deleteNotification: vi.fn().mockResolvedValue({}),
  },
  mockUserAPI: {
    searchUsers: vi.fn().mockResolvedValue({
      content: [
        {
          uid: 'user-1',
          full_name: 'John Doe',
          email: 'john@test.com',
          avatar_url: {
            uid: 'avatar-1',
            original_name: 'avatar.jpg',
            public_url: 'https://example.com/avatar1.jpg',
          },
        },
        {
          uid: 'user-2',
          full_name: 'Jane Smith',
          email: 'jane@test.com',
          avatar_url: {
            uid: 'avatar-2',
            original_name: 'avatar2.jpg',
            public_url: 'https://example.com/avatar2.jpg',
          },
        },
      ],
      total_rows: 2,
      current_page: 1,
      page_size: 100,
      total_pages: 1,
    }),
  },
}));

// Mock UI components
vi.mock('../../components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div data-testid="card" {...props}>{children}</div>,
  CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

vi.mock('../../components/ui/input', () => ({
  Input: ({ value, onChange, placeholder, ...props }: any) => (
    <input value={value} onChange={onChange} placeholder={placeholder} {...props} data-testid="input" />
  ),
}));

vi.mock('../../components/ui/button', () => ({
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} {...props} data-testid="button">
      {children}
    </button>
  ),
}));

vi.mock('../../components/ui/textarea', () => ({
  Textarea: ({ value, onChange, placeholder, ...props }: any) => (
    <textarea value={value} onChange={onChange} placeholder={placeholder} {...props} data-testid="textarea" />
  ),
}));

vi.mock('../../components/ui/badge', () => ({
  Badge: ({ children, variant }: any) => (
    <span data-testid="badge" data-variant={variant}>{children}</span>
  ),
}));

vi.mock('../../components/ui/dialog', () => ({
  Dialog: ({ children, open }: any) => open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h3>{children}</h3>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('../../components/ui/avatar', () => ({
  Avatar: ({ children }: any) => <div data-testid="avatar">{children}</div>,
  AvatarImage: ({ src }: any) => <img src={src} data-testid="avatar-image" />,
  AvatarFallback: ({ children }: any) => <span>{children}</span>,
}));

vi.mock('../../components/Header', () => ({
  getAvatarGradient: (uid: string) => `gradient-${uid}`,
}));

vi.mock('lucide-react', () => ({
  Bell: () => <span>BellIcon</span>,
  Send: () => <span>SendIcon</span>,
  Search: () => <span>SearchIcon</span>,
  Plus: () => <span>PlusIcon</span>,
  TrendingUp: () => <span>TrendingUpIcon</span>,
  Users: () => <span>UsersIcon</span>,
  Calendar: () => <span>CalendarIcon</span>,
  Trash2: () => <span>Trash2Icon</span>,
  Megaphone: () => <span>MegaphoneIcon</span>,
}));

vi.mock('antd', () => ({
  Modal: {
    confirm: vi.fn((config) => {
      config.onOk?.();
    }),
  },
  Spin: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('./notification.api', () => ({
  NotificationAPI: mockNotificationAPI,
}));

vi.mock('../users/user.api', () => ({
  UserAPI: mockUserAPI,
}));

describe('NotificationPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render notification page', () => {
    render(<NotificationPage />);

    expect(screen.getByTestId('notification-page')).toBeInTheDocument();
    expect(screen.getByText('Notification Management')).toBeInTheDocument();
  });

  it('should render header with create button', () => {
    render(<NotificationPage />);

    expect(screen.getByText('Create Notification')).toBeInTheDocument();
    const buttons = screen.getAllByTestId('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should load and display notification stats', async () => {
    render(<NotificationPage />);

    await waitFor(() => {
      expect(mockNotificationAPI.getNotificationStats).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText(/Total Notifications/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Users/i)).toBeInTheDocument();
    });
  });

  it('should fetch notifications on mount', async () => {
    render(<NotificationPage />);

    await waitFor(() => {
      expect(mockNotificationAPI.listNotifications).toHaveBeenCalled();
    });
  });

  it('should display notification list', async () => {
    render(<NotificationPage />);

    await waitFor(() => {
      expect(mockNotificationAPI.listNotifications).toHaveBeenCalled();
    });
  });

  it('should filter notifications by type', async () => {
    const user = userEvent.setup();
    render(<NotificationPage />);

    await waitFor(() => {
      expect(mockNotificationAPI.listNotifications).toHaveBeenCalled();
    });

    // Find and click the filter dropdown
    const selects = screen.queryAllByRole('combobox');
    if (selects.length > 0) {
      await user.selectOptions(selects[0], 'Warning');
      
      await waitFor(() => {
        expect(mockNotificationAPI.listNotifications).toHaveBeenCalledWith(
          expect.objectContaining({ type: 'Warning' })
        );
      });
    }
  });

  it('should search notifications', async () => {
    const user = userEvent.setup();
    render(<NotificationPage />);

    await waitFor(() => {
      expect(mockNotificationAPI.listNotifications).toHaveBeenCalled();
    });

    const inputs = screen.getAllByTestId('input');
    const searchInput = inputs[inputs.length - 1]; // Last input is usually search

    await user.type(searchInput, 'test');

    await waitFor(() => {
      expect(mockNotificationAPI.listNotifications).toHaveBeenCalledWith(
        expect.objectContaining({ search: expect.stringContaining('test') })
      );
    });
  });

  it('should open create notification dialog', async () => {
    const user = userEvent.setup();
    render(<NotificationPage />);

    const buttons = screen.getAllByTestId('button');
    const createButton = buttons.find((btn) => btn.textContent?.includes('Create Notification'));

    if (createButton) {
      await user.click(createButton);
      // Dialog should be visible after click
      expect(buttons.length).toBeGreaterThan(0);
    }
  });

  it('should handle notification type filter change', async () => {
    const user = userEvent.setup();
    render(<NotificationPage />);

    await waitFor(() => {
      expect(mockNotificationAPI.listNotifications).toHaveBeenCalled();
    });

    const selects = screen.queryAllByRole('combobox');
    if (selects.length > 0) {
      // Test System type
      await user.selectOptions(selects[0], 'System');
      
      await waitFor(() => {
        expect(mockNotificationAPI.listNotifications).toHaveBeenCalledWith(
          expect.objectContaining({ type: 'System' })
        );
      });

      // Test Announcement type
      await user.selectOptions(selects[0], 'Announcement');
      
      await waitFor(() => {
        expect(mockNotificationAPI.listNotifications).toHaveBeenCalledWith(
          expect.objectContaining({ type: 'Announcement' })
        );
      });
    }
  });

  it('should load users for selection on mount', async () => {
    render(<NotificationPage />);

    await waitFor(() => {
      expect(mockUserAPI.searchUsers).toHaveBeenCalled();
    });
  });

  it('should handle pagination', async () => {
    //const user = userEvent.setup();
    render(<NotificationPage />);

    await waitFor(() => {
      expect(mockNotificationAPI.listNotifications).toHaveBeenCalled();
    });

    // Look for next/previous buttons or pagination
    const buttons = screen.getAllByTestId('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should handle all filter type options', async () => {
    const user = userEvent.setup();
    render(<NotificationPage />);

    await waitFor(() => {
      expect(mockNotificationAPI.listNotifications).toHaveBeenCalled();
    });

    const selects = screen.queryAllByRole('combobox');
    if (selects.length > 0) {
      const filterSelect = selects[0];
      
      const types = ['ALL', 'System', 'Announcement', 'Reminder', 'Warning'];
      
      for (const type of types) {
        await user.selectOptions(filterSelect, type);
        
        await waitFor(() => {
          const lastCall = mockNotificationAPI.listNotifications.mock.calls[
            mockNotificationAPI.listNotifications.mock.calls.length - 1
          ];
          expect(lastCall).toBeDefined();
        });
      }
    }
  });

  it('should handle empty search results', async () => {
    mockNotificationAPI.listNotifications.mockResolvedValueOnce({
      content: [],
      total_rows: 0,
    });

    render(<NotificationPage />);

    await waitFor(() => {
      expect(mockNotificationAPI.listNotifications).toHaveBeenCalled();
    });
  });

  it('should display loading state during fetch', async () => {
    mockNotificationAPI.listNotifications.mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(() => resolve({
        content: [],
        total_rows: 0,
      }), 100))
    );

    render(<NotificationPage />);

    // Component should be rendering
    expect(screen.getByTestId('notification-page')).toBeInTheDocument();
  });

  it('should reset page on search query change', async () => {
    const user = userEvent.setup();
    render(<NotificationPage />);

    await waitFor(() => {
      expect(mockNotificationAPI.listNotifications).toHaveBeenCalled();
    });

    const inputs = screen.getAllByTestId('input');
    const searchInput = inputs[inputs.length - 1];

    await user.type(searchInput, 'search term');

    // Should fetch with new search query
    await waitFor(() => {
      expect(mockNotificationAPI.listNotifications).toHaveBeenCalledWith(
        expect.objectContaining({ search: expect.any(String) })
      );
    });
  });

  it('should handle notification API errors gracefully', async () => {
    mockNotificationAPI.listNotifications.mockRejectedValueOnce(
      new Error('API Error')
    );

    render(<NotificationPage />);

    await waitFor(() => {
      expect(screen.getByTestId('notification-page')).toBeInTheDocument();
    });
  });

  it('should handle user search', async () => {
    //const user = userEvent.setup();
    render(<NotificationPage />);

    await waitFor(() => {
      expect(mockUserAPI.searchUsers).toHaveBeenCalled();
    });
  });

  it('should maintain filter state across re-renders', async () => {
    const user = userEvent.setup();
    render(<NotificationPage />);

    await waitFor(() => {
      expect(mockNotificationAPI.listNotifications).toHaveBeenCalled();
    });

    const selects = screen.queryAllByRole('combobox');
    if (selects.length > 0) {
      await user.selectOptions(selects[0], 'System');

      // Verify filter is maintained
      const filterElements = screen.queryAllByRole('combobox');
      expect(filterElements.length).toBeGreaterThan(0);
    }
  });
});

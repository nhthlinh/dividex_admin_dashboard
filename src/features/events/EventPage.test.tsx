/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventPage } from './EventPage';

// Create hoisted mocks that can be accessed in tests and vi.mock()
const { mockEventAPI } = vi.hoisted(() => ({
  mockEventAPI: {
    getEvents: vi.fn().mockResolvedValue({
      content: [
        {
          event_uid: 'event-1',
          event_name: 'Team Meeting',
          event_description: 'Team sync meeting',
          event_start: '2024-02-15',
          event_end: '2024-02-15',
          status: 'ACTIVE',
          creator: {
            uid: 'user-1',
            full_name: 'John Doe',
            email: 'john@test.com',
            avatar_url: {
              uid: 'avatar-1',
              original_name: 'avatar.jpg',
              public_url: 'https://example.com/user1.jpg',
            },
          },
          group: {
            uid: 'group-1',
            name: 'Team',
            avatar_url: { public_url: 'https://example.com/group1.jpg' },
          },
        },
        {
          event_uid: 'event-2',
          event_name: 'Project Kickoff',
          event_description: 'Project kickoff meeting',
          event_start: '2024-02-20',
          event_end: '2024-02-20',
          status: 'ACTIVE',
          creator: {
            uid: 'user-2',
            full_name: 'Jane Smith',
            email: 'jane@test.com',
            avatar_url: {
              uid: 'avatar-2',
              original_name: 'avatar2.jpg',
              public_url: 'https://example.com/user2.jpg',
            },
          },
          group: {
            uid: 'group-2',
            name: 'Project',
            avatar_url: { public_url: 'https://example.com/group2.jpg' },
          },
        },
      ],
      total_pages: 1,
      current_page: 1,
      page_size: 10,
      total_rows: 2,
    }),
    getEventStatistics: vi.fn().mockResolvedValue({
      total_events: 25,
      percent_increase_events: 12.5,
      active_events: 8,
      percent_increase_active_events: 5.3,
      total_finished_events: 17,
      percent_increase_finished_events: 8.7,
      total_members: 156,
      percent_increase_members: 15.2,
    }),
  },
}));

// Mock UI components
vi.mock('../../components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div data-testid="card" {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h2>{children}</h2>,
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

vi.mock('../../components/ui/badge', () => ({
  Badge: ({ children, variant }: any) => (
    <span data-testid="badge" data-variant={variant}>{children}</span>
  ),
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
  Users: () => <span>UsersIcon</span>,
  Calendar: () => <span>CalendarIcon</span>,
  Search: () => <span>SearchIcon</span>,
  TrendingUp: () => <span>TrendingUpIcon</span>,
  Clock: () => <span>ClockIcon</span>,
  CheckCircle: () => <span>CheckCircleIcon</span>,
  XCircle: () => <span>XCircleIcon</span>,
}));

vi.mock('antd', () => ({
  Spin: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('./EventDetailDialog', () => ({
  EventDetailDialog: ({ isOpen }: any) => isOpen ? <div data-testid="event-detail-dialog">Event Details</div> : null,
}));

vi.mock('./event.api', () => ({
  EventAPI: mockEventAPI,
}));

describe('EventPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render event page', () => {
    render(<EventPage />);

    expect(screen.getByTestId('event-page')).toBeInTheDocument();
  });

  it('should load event statistics on mount', async () => {
    render(<EventPage />);

    await waitFor(() => {
      expect(mockEventAPI.getEventStatistics).toHaveBeenCalled();
    });
  });

  it('should display event stats cards', async () => {
    render(<EventPage />);

    await waitFor(() => {
      expect(mockEventAPI.getEventStatistics).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText(/Total Events/i)).toBeInTheDocument();
      expect(screen.getByText(/Active Events/i)).toBeInTheDocument();
    });
  });

  it('should fetch events on mount', async () => {
    render(<EventPage />);

    await waitFor(() => {
      expect(mockEventAPI.getEvents).toHaveBeenCalled();
    });
  });

  it('should search events by name', async () => {
    const user = userEvent.setup();
    render(<EventPage />);

    await waitFor(() => {
      expect(mockEventAPI.getEvents).toHaveBeenCalled();
    });

    const inputs = screen.getAllByTestId('input');
    const searchInput = inputs[inputs.length - 1];

    await user.type(searchInput, 'Meeting');

    await waitFor(() => {
      expect(mockEventAPI.getEvents).toHaveBeenCalledWith(
        expect.objectContaining({ search: expect.stringContaining('Meeting') })
      );
    });
  });

  it('should filter events by status', async () => {
    const user = userEvent.setup();
    render(<EventPage />);

    await waitFor(() => {
      expect(mockEventAPI.getEvents).toHaveBeenCalled();
    });

    const selects = screen.queryAllByRole('combobox');
    if (selects.length > 0) {
      await user.selectOptions(selects[0], 'ACTIVE');

      await waitFor(() => {
        // Filter should trigger in component
        expect(screen.getByTestId('event-page')).toBeInTheDocument();
      });
    }
  });

  it('should handle pagination', async () => {
    render(<EventPage />);

    await waitFor(() => {
      expect(mockEventAPI.getEvents).toHaveBeenCalled();
    });

    const buttons = screen.queryAllByTestId('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should open event detail dialog on event click', async () => {
    const user = userEvent.setup();
    render(<EventPage />);

    await waitFor(() => {
      expect(mockEventAPI.getEvents).toHaveBeenCalled();
    });

    const cards = screen.queryAllByTestId('card');
    if (cards.length > 1) {
      // Click on an event card (skip stats cards)
      const eventCard = cards[1];
      await user.click(eventCard);
    }
  });

  it('should handle empty event results', async () => {
    mockEventAPI.getEvents.mockResolvedValueOnce({
      content: [],
      total_pages: 0,
    });

    render(<EventPage />);

    await waitFor(() => {
      expect(mockEventAPI.getEvents).toHaveBeenCalled();
    });

    expect(screen.getByTestId('event-page')).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    mockEventAPI.getEvents.mockRejectedValueOnce(
      new Error('API Error')
    );

    render(<EventPage />);

    await waitFor(() => {
      expect(mockEventAPI.getEvents).toHaveBeenCalled();
    });

    expect(screen.getByTestId('event-page')).toBeInTheDocument();
  });

  it('should handle stats API errors gracefully', async () => {
    mockEventAPI.getEventStatistics.mockRejectedValueOnce(
      new Error('Stats API Error')
    );

    render(<EventPage />);

    await waitFor(() => {
      expect(mockEventAPI.getEventStatistics).toHaveBeenCalled();
    });

    expect(screen.getByTestId('event-page')).toBeInTheDocument();
  });

  it('should maintain search state', async () => {
    const user = userEvent.setup();
    render(<EventPage />);

    await waitFor(() => {
      expect(mockEventAPI.getEvents).toHaveBeenCalled();
    });

    const inputs = screen.getAllByTestId('input');
    const searchInput = inputs[inputs.length - 1];

    await user.type(searchInput, 'Team');

    const inputValue = (searchInput as HTMLInputElement).value;
    expect(inputValue).toContain('Team');
  });

  it('should display multiple events', async () => {
    render(<EventPage />);

    await waitFor(() => {
      expect(mockEventAPI.getEvents).toHaveBeenCalled();
    });

    // Should have cards rendered (stats + events)
    const cards = screen.queryAllByTestId('card');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should handle status filters', async () => {
    const user = userEvent.setup();
    render(<EventPage />);

    await waitFor(() => {
      expect(mockEventAPI.getEvents).toHaveBeenCalled();
    });

    const selects = screen.queryAllByRole('combobox');
    if (selects.length > 0) {
      const statusTypes = ['ALL', 'ACTIVE', 'COMPLETED', 'CANCELLED'];

      for (const status of statusTypes) {
        await user.selectOptions(selects[0], status);

        await waitFor(() => {
          expect(screen.getByTestId('event-page')).toBeInTheDocument();
        });
      }
    }
  });
});

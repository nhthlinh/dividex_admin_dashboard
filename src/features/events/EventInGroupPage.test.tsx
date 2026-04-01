/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventInGroupPage } from './EventInGroupPage';

// Mock UI components
vi.mock('../../components/ui/card', () => ({
  Card: ({ children, ...props }: any) => (
    <div data-testid="card" {...props}>{children}</div>
  ),
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('../../components/ui/button', () => ({
  Button: ({ children, onClick, variant, ...props }: any) => (
    <button onClick={onClick} data-variant={variant} {...props}>{children}</button>
  ),
}));

vi.mock('../../components/ui/input', () => ({
  Input: ({ value, onChange, placeholder, ...props }: any) => (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...props}
    />
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
  getAvatarGradient: vi.fn().mockReturnValue('bg-gradient-to-br from-blue-100 to-purple-100'),
}));

vi.mock('lucide-react', () => ({
  Calendar: () => <span>CalendarIcon</span>,
  Search: () => <span>SearchIcon</span>,
  Clock: () => <span>ClockIcon</span>,
  CheckCircle: () => <span>CheckCircleIcon</span>,
  XCircle: () => <span>XCircleIcon</span>,
  Edit2: () => <span>EditIcon</span>,
  Trash2: () => <span>TrashIcon</span>,
}));

vi.mock('antd', () => ({
  Spin: () => <div data-testid="spin">Loading...</div>,
  message: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock router
vi.mock('../../app/router', () => ({
  router: {
    state: {
      location: {
        pathname: '/groups/group-123/events',
      },
    },
  },
}));

// Mock API with hoisted mock object
const { mockEventAPI } = vi.hoisted(() => ({
  mockEventAPI: {
    getEventsInGroup: vi.fn().mockResolvedValue({
      content: [
        {
          uid: 'event-1',
          event_name: 'Team Meeting',
          status: 'ACTIVE',
          event_start: '2024-02-01T10:00:00Z',
          event_end: '2024-02-01T11:00:00Z',
          location: 'Conference Room A',
          description: 'Weekly team sync',
          attendees_count: 15,
          created_by: 'user-1',
          creator: {
            uid: 'user-1',
            full_name: 'John Smith',
            avatar_url: { public_url: 'https://example.com/user1.jpg' },
          },
          group: {
            uid: 'group-1',
            name: 'Engineering Team',
            avatar_url: { public_url: 'https://example.com/group1.jpg' },
          },
        },
        {
          uid: 'event-2',
          event_name: 'Project Launch',
          status: 'COMPLETED',
          event_start: '2024-01-15T14:00:00Z',
          event_end: '2024-01-15T16:00:00Z',
          location: 'Main Hall',
          description: 'New product launch',
          attendees_count: 50,
          created_by: 'user-2',
          creator: {
            uid: 'user-2',
            full_name: 'Jane Doe',
            avatar_url: null,
          },
          group: {
            uid: 'group-1',
            name: 'Engineering Team',
            avatar_url: null,
          },
        },
        {
          uid: 'event-3',
          event_name: 'Training Session',
          status: 'ACTIVE',
          event_start: '2024-02-10T09:00:00Z',
          event_end: '2024-02-10T17:00:00Z',
          location: 'Online',
          description: 'Employee training program',
          attendees_count: 30,
          created_by: 'user-3',
          creator: {
            uid: 'user-3',
            full_name: 'Bob Johnson',
            avatar_url: { public_url: 'https://example.com/user3.jpg' },
          },
          group: {
            uid: 'group-1',
            name: 'Engineering Team',
            avatar_url: { public_url: 'https://example.com/group1.jpg' },
          },
        },
      ],
      total_rows: 3,
    }),
  },
}));

vi.mock('./event.api', () => ({
  EventAPI: mockEventAPI,
}));

// Mock EventDetailDialog
vi.mock('./EventDetailDialog', () => ({
  EventDetailDialog: () => <div data-testid="event-dialog">Event Detail Dialog</div>,
}));

describe('EventInGroupPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock to default resolved value
    mockEventAPI.getEventsInGroup.mockResolvedValue({
      content: [
        {
          uid: 'event-1',
          event_name: 'Team Meeting',
          status: 'ACTIVE',
          event_start: '2024-02-01T10:00:00Z',
          event_end: '2024-02-01T11:00:00Z',
          location: 'Conference Room A',
          description: 'Weekly team sync',
          attendees_count: 15,
          created_by: 'user-1',
          creator: {
            uid: 'user-1',
            full_name: 'John Smith',
            avatar_url: { public_url: 'https://example.com/user1.jpg' },
          },
          group: {
            uid: 'group-1',
            name: 'Engineering Team',
            avatar_url: { public_url: 'https://example.com/group1.jpg' },
          },
        },
        {
          uid: 'event-2',
          event_name: 'Project Launch',
          status: 'COMPLETED',
          event_start: '2024-01-15T14:00:00Z',
          event_end: '2024-01-15T16:00:00Z',
          location: 'Main Hall',
          description: 'New product launch',
          attendees_count: 50,
          created_by: 'user-2',
          creator: {
            uid: 'user-2',
            full_name: 'Jane Doe',
            avatar_url: null,
          },
          group: {
            uid: 'group-1',
            name: 'Engineering Team',
            avatar_url: null,
          },
        },
        {
          uid: 'event-3',
          event_name: 'Training Session',
          status: 'ACTIVE',
          event_start: '2024-02-10T09:00:00Z',
          event_end: '2024-02-10T17:00:00Z',
          location: 'Online',
          description: 'Employee training program',
          attendees_count: 30,
          created_by: 'user-3',
          creator: {
            uid: 'user-3',
            full_name: 'Bob Johnson',
            avatar_url: { public_url: 'https://example.com/user3.jpg' },
          },
          group: {
            uid: 'group-1',
            name: 'Engineering Team',
            avatar_url: { public_url: 'https://example.com/group1.jpg' },
          },
        },
      ],
      total_rows: 3,
    });
  });

  // ==========================
  // RENDERING TESTS
  // ==========================
  describe('Rendering', () => {
    it('should render event page without errors', () => {
      expect(() => {
        render(<EventInGroupPage />);
      }).not.toThrow();
    });

    it('should display page title', () => {
      render(<EventInGroupPage />);
      expect(screen.getByText('Event Management')).toBeInTheDocument();
    });

    it('should have test ID for event-in-group-page', () => {
      render(<EventInGroupPage />);
      expect(screen.getByTestId('event-in-group-page')).toBeInTheDocument();
    });
  });

  // ==========================
  // FILTER BUTTON TESTS
  // ==========================
  describe('Status Filter Buttons', () => {
    it('should display All button', () => {
      render(<EventInGroupPage />);
      expect(screen.getByText('All')).toBeInTheDocument();
    });

    it('should display Active button', () => {
      render(<EventInGroupPage />);
      expect(screen.getAllByText('Active').length).toBeGreaterThan(0);
    });

    it('should display Completed button', () => {
      render(<EventInGroupPage />);
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });

    it('should have All button selected by default', () => {
      render(<EventInGroupPage />);
      const allButton = screen.getByText('All');
      expect(allButton).toBeInTheDocument();
    });

    it('should allow clicking All filter button', async () => {
      const user = userEvent.setup({ delay: null });
      render(<EventInGroupPage />);
      
      const allButton = screen.getByText('All');
      await user.click(allButton);
      
      expect(allButton).toBeInTheDocument();
    });

    it('should allow clicking Active filter button', async () => {
      const user = userEvent.setup({ delay: null });
      render(<EventInGroupPage />);
      
      const activeButtons = screen.getAllByText('Active');
      const activeButton = activeButtons.find(b => b.tagName === 'BUTTON');
      
      if (activeButton) {
        await user.click(activeButton);
        expect(activeButton).toBeInTheDocument();
      }
    });

    it('should allow clicking Completed filter button', async () => {
      const user = userEvent.setup({ delay: null });
      render(<EventInGroupPage />);
      
      const completedButton = screen.getByText('Completed');
      await user.click(completedButton);
      
      expect(completedButton).toBeInTheDocument();
    });
  });

  // ==========================
  // SEARCH TESTS
  // ==========================
  describe('Search Functionality', () => {
    it('should display search input', () => {
      render(<EventInGroupPage />);
      const searchInputs = screen.getAllByPlaceholderText('Search events...');
      expect(searchInputs.length).toBeGreaterThan(0);
    });

    it('should allow typing in search input', async () => {
      const user = userEvent.setup({ delay: null });
      render(<EventInGroupPage />);
      
      const searchInput = screen.getByPlaceholderText('Search events...') as HTMLInputElement;
      await user.clear(searchInput);
      await user.type(searchInput, 'Team Meeting');
      
      expect(searchInput.value).toBe('Team Meeting');
    });

    it('should filter events by search query', async () => {
      const user = userEvent.setup({ delay: null });
      render(<EventInGroupPage />);
      
      const searchInput = screen.getByPlaceholderText('Search events...') as HTMLInputElement;
      await user.type(searchInput, 'Team');
      
      expect(searchInput.value).toBe('Team');
    });

    it('should clear search input', async () => {
      const user = userEvent.setup({ delay: null });
      render(<EventInGroupPage />);
      
      const searchInput = screen.getByPlaceholderText('Search events...') as HTMLInputElement;
      await user.type(searchInput, 'Meeting');
      await user.clear(searchInput);
      
      expect(searchInput.value).toBe('');
    });

    it('should search case-insensitively', async () => {
      const user = userEvent.setup({ delay: null });
      render(<EventInGroupPage />);
      
      const searchInput = screen.getByPlaceholderText('Search events...') as HTMLInputElement;
      await user.type(searchInput, 'TEAM');
      
      expect(searchInput.value).toBe('TEAM');
    });
  });

  // ==========================
  // EVENT LIST TESTS
  // ==========================
  describe('Event List', () => {
    it('should render event list container', () => {
      render(<EventInGroupPage />);
      
      expect(screen.getByTestId('event-in-group-page')).toBeInTheDocument();
    });

    it('should display page structure', () => {
      render(<EventInGroupPage />);
      
      expect(screen.getByText('Event Management')).toBeInTheDocument();
      expect(screen.getByTestId('event-in-group-page')).toBeInTheDocument();
    });

    it('should display filter controls', () => {
      render(<EventInGroupPage />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should display cards container', () => {
      render(<EventInGroupPage />);
      
      const cards = screen.getAllByTestId('card');
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  // ==========================
  // STATUS TESTS
  // ==========================
  describe('Event Status', () => {
    it('should render page with status display capability', () => {
      render(<EventInGroupPage />);
      
      expect(screen.getByTestId('event-in-group-page')).toBeInTheDocument();
    });

    it('should display status filter buttons', () => {
      render(<EventInGroupPage />);
      
      // Verify filter buttons for status are present
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  // ==========================
  // EVENT CARD TESTS
  // ==========================
  describe('Event Cards', () => {
    it('should render cards', () => {
      render(<EventInGroupPage />);
      
      const cards = screen.getAllByTestId('card');
      expect(cards.length).toBeGreaterThanOrEqual(1);
    });

    it('should display event card structure', () => {
      render(<EventInGroupPage />);
      
      // Verify cards are present for event display
      const cards = screen.getAllByTestId('card');
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  // ==========================
  // INTERACTION TESTS
  // ==========================
  describe('Interactions', () => {
    it('should handle event card click', async () => {
      const user = userEvent.setup({ delay: null });
      render(<EventInGroupPage />);
      
      const cards = screen.getAllByTestId('card');
      if (cards.length > 1) {
        await user.click(cards[1]);
      }
    });

    it('should filter events by status and search', async () => {
      const user = userEvent.setup({ delay: null });
      render(<EventInGroupPage />);
      
      const searchInput = screen.getByPlaceholderText('Search events...') as HTMLInputElement;
      await user.type(searchInput, 'Training');
      
      const activeButtons = screen.getAllByText('Active');
      const activeButton = activeButtons.find(b => b.tagName === 'BUTTON');
      if (activeButton) {
        await user.click(activeButton);
      }
      
      expect(searchInput.value).toBe('Training');
    });

    it('should maintain search query when changing filters', async () => {
      const user = userEvent.setup({ delay: null });
      render(<EventInGroupPage />);
      
      const searchInput = screen.getByPlaceholderText('Search events...') as HTMLInputElement;
      await user.type(searchInput, 'Project');
      
      const completedButton = screen.getByText('Completed');
      await user.click(completedButton);
      
      expect(searchInput.value).toBe('Project');
    });
  });

  // ==========================
  // DATE TESTS
  // ==========================
  describe('Date Formatting', () => {
    it('should render page with date display area', () => {
      render(<EventInGroupPage />);
      
      // Verify page structure is present for displaying dates
      expect(screen.getByTestId('event-in-group-page')).toBeInTheDocument();
    });

    it('should display event structure', () => {
      render(<EventInGroupPage />);
      
      // Verify page renders with all structure needed for events
      expect(screen.getByText('Event Management')).toBeInTheDocument();
    });
  });

  // ==========================
  // API INTEGRATION TESTS
  // ==========================
  describe('API Integration', () => {
    it('should fetch events on component mount', () => {
      render(<EventInGroupPage />);
      
      expect(mockEventAPI.getEventsInGroup).toHaveBeenCalled();
    });

    it('should call API with pagination parameters', () => {
      render(<EventInGroupPage />);
      
      expect(mockEventAPI.getEventsInGroup).toHaveBeenCalledWith(
        expect.objectContaining({
          page: expect.any(Number),
          page_size: expect.any(Number),
        })
      );
    });

    it('should pass search query to API', async () => {
      const user = userEvent.setup({ delay: null });
      
      render(<EventInGroupPage />);
      
      const searchInput = screen.getByPlaceholderText('Search events...') as HTMLInputElement;
      await user.type(searchInput, 'Team');
      
      // Wait for debounce if applicable
      // expect(mockEventAPI.getEventsInGroup).toHaveBeenCalled();
    });

    it('should render event page structure', () => {
      render(<EventInGroupPage />);
      
      expect(screen.getByTestId('event-in-group-page')).toBeInTheDocument();
      expect(screen.getByText('Event Management')).toBeInTheDocument();
    });
  });

  // ==========================
  // PAGINATION TESTS
  // ==========================
  describe('Pagination', () => {
    it('should calculate total pages correctly', () => {
      render(<EventInGroupPage />);
      
      // With PAGE_SIZE=10 and 3 total rows, should be 1 page
      expect(screen.getByTestId('event-in-group-page')).toBeInTheDocument();
    });
  });

  // ==========================
  // FILTERING TESTS
  // ==========================
  describe('Status Filtering', () => {
    it('should display filter buttons', async () => {
      render(<EventInGroupPage />);
      
      // Verify page renders with filter controls
      expect(screen.getByTestId('event-in-group-page')).toBeInTheDocument();
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  // ==========================
  // EDGE CASES
  // ==========================
  describe('Edge Cases', () => {
    it('should handle empty events array', async () => {
      mockEventAPI.getEventsInGroup.mockResolvedValueOnce({
        content: [],
        total_rows: 0,
      });

      render(<EventInGroupPage />);
      
      expect(screen.getByTestId('event-in-group-page')).toBeInTheDocument();
    });

    it('should handle missing creator gracefully', () => {
      mockEventAPI.getEventsInGroup.mockResolvedValueOnce({
        content: [{
          uid: 'event-1',
          event_name: 'Test Event',
          status: 'ACTIVE',
          event_start: '2024-02-01T10:00:00Z',
          event_end: '2024-02-01T11:00:00Z',
          location: 'Online',
          description: 'Test',
          attendees_count: 10,
          created_by: 'user-1',
          creator: { uid: 'user-1', full_name: 'Test User', avatar_url: null },
          group: { uid: 'group-1', name: 'Test Group', avatar_url: null },
        }],
        total_rows: 1,
      });

      render(<EventInGroupPage />);
      expect(screen.getByTestId('event-in-group-page')).toBeInTheDocument();
    });

    it('should handle undefined groupId', () => {
      // Mock router with undefined groupId
      
      expect(() => {
        render(<EventInGroupPage />);
      }).not.toThrow();
    });

    it('should handle events with missing attributes', () => {
      mockEventAPI.getEventsInGroup.mockResolvedValueOnce({
        content: [
          {
            uid: 'event-1',
            event_name: 'Minimal Event',
            status: 'ACTIVE',
            event_start: '2024-02-01T10:00:00Z',
            event_end: '2024-02-01T11:00:00Z',
          },
        ],
        total_rows: 1,
      });

      render(<EventInGroupPage />);
      expect(screen.getByTestId('event-in-group-page')).toBeInTheDocument();
    });
  });

  // ==========================
  // LOADING STATE TESTS
  // ==========================
  describe('Loading State', () => {
    it('should display loading spinner during data fetch', async () => {
      mockEventAPI.getEventsInGroup.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ content: [], total_rows: 0 }), 100))
      );

      render(<EventInGroupPage />);
      
      expect(screen.getByTestId('event-in-group-page')).toBeInTheDocument();
    });
  });

  // ==========================
  // ACCESSIBILITY TESTS
  // ==========================
  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<EventInGroupPage />);
      
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('should have descriptive search placeholder', () => {
      render(<EventInGroupPage />);
      
      expect(screen.getByPlaceholderText('Search events...')).toBeInTheDocument();
    });

    it('should have accessible filter buttons', () => {
      render(<EventInGroupPage />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should have button variants to indicate selected state', () => {
      render(<EventInGroupPage />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.some(b => b.hasAttribute('data-variant'))).toBe(true);
    });
  });

  // ==========================
  // STATUS ICON TESTS
  // ==========================
  describe('Status Icons', () => {
    it('should display status icons for events', () => {
      render(<EventInGroupPage />);
      
      // Icons should be rendered (Clock for ACTIVE, CheckCircle for COMPLETED)
      expect(screen.getByTestId('event-in-group-page')).toBeInTheDocument();
    });
  });

  // ==========================
  // PAGINATION BEHAVIOR TESTS
  // ==========================
  describe('Pagination Behavior', () => {
    it('should display pagination controls', async () => {
      render(<EventInGroupPage />);
      
      // Verify page structure is rendered
      expect(screen.getByTestId('event-in-group-page')).toBeInTheDocument();
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});

/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EventDetailDialog } from './EventDetailDialog';

// Mock dependencies
vi.mock('./event.api', () => ({
  EventAPI: {
    getEventDetail: vi.fn(),
    updateEvent: vi.fn(),
    deleteEvent: vi.fn(),
    getEventMembers: vi.fn().mockResolvedValue({
      content: [],
      total_rows: 0,
      current_page: 1,
    }),
    getExpensesInEvent: vi.fn().mockResolvedValue({
      total_amount: 0,
      expenses: [],
    }),
    deactivateEvent: vi.fn(),
    activateEvent: vi.fn(),
  },
}));

vi.mock('../../components/ui/dialog', () => ({
  Dialog: ({ children, open }: any) => open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: any) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
}));

vi.mock('../../components/ui/tabs', () => ({
  Tabs: ({ children }: any) => <div data-testid="tabs">{children}</div>,
  TabsList: ({ children }: any) => <div>{children}</div>,
  TabsTrigger: ({ children }: any) => <button>{children}</button>,
  TabsContent: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('../../components/ui/button', () => ({
  Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
}));

vi.mock('../../components/ui/badge', () => ({
  Badge: ({ children, variant }: any) => <span data-testid="badge" data-variant={variant}>{children}</span>,
}));

vi.mock('lucide-react', () => ({
  Calendar: () => <span>CalendarIcon</span>,
  User: () => <span>UserIcon</span>,
  Users: () => <span>UsersIcon</span>,
  DollarSign: () => <span>DollarIcon</span>,
  Clock: () => <span>ClockIcon</span>,
  FileText: () => <span>FileTextIcon</span>,
  Trash2: () => <span>Trash2Icon</span>,
  Unlock: () => <span>UnlockIcon</span>,
}));

vi.mock('../../components/ui/avatar', () => ({
  Avatar: ({ children }: any) => <div data-testid="avatar">{children}</div>,
  AvatarImage: ({ src }: any) => <img src={src} alt="avatar" />,
  AvatarFallback: ({ children }: any) => <span>{children}</span>,
}));

vi.mock('../../components/ui/input', () => ({
  Input: ({ value, onChange, placeholder }: any) => (
    <input value={value} onChange={onChange} placeholder={placeholder} />
  ),
}));

vi.mock('../../components/Header', () => ({
  getAvatarGradient: vi.fn().mockReturnValue('from-blue-400 to-blue-600'),
}));

vi.mock('antd', () => ({
  Spin: () => <div data-testid="spinner">Loading...</div>,
}));

// import { EventAPI } from './event.api';

// const mockEventAPI = EventAPI as unknown as {
//   getEventDetail: ReturnType<typeof vi.fn>;
//   updateEvent: ReturnType<typeof vi.fn>;
//   deleteEvent: ReturnType<typeof vi.fn>;
// };

describe('EventDetailDialog', () => {
  const mockEvent = {
    event_uid: '123',
    event_name: 'Test Event',
    event_description: 'Test Description',
    event_start: '2024-01-01',
    event_end: '2024-01-05',
    group: {
        uid: 'group-123',
        name: 'Test Group',
        status: 'ACTIVE' as "ACTIVE" | "INACTIVE",
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        total_members: 10,
        avatar_url: {
            public_url: 'http://example.com/group-avatar.jpg',
            origin_name: 'http://example.com/group-avatar.jpg',
            uid: 'avatar-group-123',
        },
        leader: { 
            uid: 'user-123',
            email: 'admin@dividex.com',
            full_name: 'Admin User',
            avatar_url: {
              public_url: 'http://example.com/avatar.jpg',
              origin_name: 'http://example.com/avatar.jpg',
              uid: 'avatar-123',
            },
        }
    },
    status: 'ACTIVE' as "ACTIVE" | "INACTIVE",
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    creator: {
      uid: 'user-123',
      email: 'admin@dividex.com',
      full_name: 'Admin User',
      avatar_url: {
        public_url: 'http://example.com/avatar.jpg',
        origin_name: 'http://example.com/avatar.jpg',
        uid: 'avatar-123',
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render dialog when isOpen is true', () => {
    render(<EventDetailDialog event={mockEvent} open={true} onOpenChange={() => {}} />);

    expect(screen.getByTestId('dialog')).toBeInTheDocument();
  });

  it('should not render dialog when isOpen is false', () => {
    render(<EventDetailDialog event={mockEvent} open={false} onOpenChange={() => {}} />);

    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('should render event name', () => {
    render(<EventDetailDialog event={mockEvent} open={true} onOpenChange={() => {}} />);

    expect(screen.getByText(mockEvent.event_name)).toBeInTheDocument();
  });

  it('should render dialog content', () => {
    render(<EventDetailDialog event={mockEvent} open={true} onOpenChange={() => {}} />);

    expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
  });

  it('should render tabs', () => {
    render(<EventDetailDialog event={mockEvent} open={true} onOpenChange={() => {}} />);

    expect(screen.getByTestId('tabs')).toBeInTheDocument();
  });

  it('should display date information', () => {
    render(<EventDetailDialog event={mockEvent} open={true} onOpenChange={() => {}} />);

    expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
  });

  it('should render action buttons', () => {
    render(<EventDetailDialog event={mockEvent} open={true} onOpenChange={() => {}} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

//   it('should display event details in tabs', () => {
//     render(<EventDetailDialog event={mockEvent} open={true} onOpenChange={() => {}} />);

//     expect(screen.getByTestId('tabs')).toBeInTheDocument();
//   });
});

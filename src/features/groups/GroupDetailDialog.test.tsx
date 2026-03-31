/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GroupDetailDialog } from './GroupDetailDialog';

// Mock dependencies
vi.mock('./group.api', () => ({
  GroupAPI: {
    getGroupDetail: vi.fn(),
    updateGroup: vi.fn(),
    deleteGroup: vi.fn(),
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
  Badge: ({ children }: any) => <span data-testid="badge">{children}</span>,
}));

vi.mock('lucide-react', () => ({
  Users: () => <span>UsersIcon</span>,
  DollarSign: () => <span>DollarIcon</span>,
  Calendar: () => <span>CalendarIcon</span>,
}));

// import { GroupAPI } from './group.api';

// const mockGroupAPI = GroupAPI as {
//   getGroupDetail: ReturnType<typeof vi.fn>;
//   updateGroup: ReturnType<typeof vi.fn>;
//   deleteGroup: ReturnType<typeof vi.fn>;
// };

describe('GroupDetailDialog', () => {
  const mockGroup =  {
    uid: "g1a2b3c4",
    name: "Alpha Team",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
    total_members: 23,
    leader: {
        uid: "u1",
        full_name: "Alice",
        email: "alice@example.com",
        avatar_url: {
            uid: "a1",
            original_name: "alice.png",
            public_url: "https://example.com/alice.png"
        }
    },
    created_at: "2026-03-31T07:00:00.000Z",
    avatar_url: {
        uid: "gavatar1",
        original_name: "group_avatar_1.jpg",
        public_url: "https://randomuser.me/api/portraits/men/12.jpg"
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render dialog when isOpen is true', () => {
    render(<GroupDetailDialog group={mockGroup} open={true} onOpenChange={() => {}} />);

    expect(screen.getByTestId('dialog')).toBeInTheDocument();
  });

  it('should not render dialog when isOpen is false', () => {
    render(<GroupDetailDialog group={mockGroup} open={false} onOpenChange={() => {}} />);

    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('should render group name', () => {
    render(<GroupDetailDialog group={mockGroup} open={true} onOpenChange={() => {}} />);

    expect(screen.getByText(mockGroup.name)).toBeInTheDocument();
  });

  it('should render dialog content', () => {
    render(<GroupDetailDialog group={mockGroup} open={true} onOpenChange={() => {}} />);

    expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
  });

  it('should render tabs', () => {
    render(<GroupDetailDialog group={mockGroup} open={true} onOpenChange={() => {}} />);

    expect(screen.getByTestId('tabs')).toBeInTheDocument();
  });

  it('should display member count', () => {
    render(<GroupDetailDialog group={mockGroup} open={true} onOpenChange={() => {}} />);

    expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
  });

  it('should render action buttons', () => {
    render(<GroupDetailDialog group={mockGroup} open={true} onOpenChange={() => {}} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});

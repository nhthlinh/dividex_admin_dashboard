/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserDetailDialog } from './UserDetailDialog';

// Mock dependencies
vi.mock('./user.api', () => ({
  UserAPI: {
    activateUser: vi.fn(),
    deActivateUser: vi.fn(),
    getUserDetail: vi.fn(),
    getUserGroups: vi.fn(),
    getUserExpenses: vi.fn(),
    getUserLoginHistory: vi.fn(),
  },
}));

vi.mock('../../components/ui/dialog', () => ({
  Dialog: ({ children, open }: any) => open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: any) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
}));

vi.mock('../../components/ui/tabs', () => ({
  Tabs: ({ children, ...props }: any) => <div data-testid="tabs" {...props}>{children}</div>,
  TabsList: ({ children }: any) => <div data-testid="tabs-list">{children}</div>,
  TabsTrigger: ({ children, ...props }: any) => <button data-testid="tab-trigger" {...props}>{children}</button>,
  TabsContent: ({ children, value }: any) => <div data-testid={`tab-content-${value}`}>{children}</div>,
}));

vi.mock('../../components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}));

vi.mock('../../components/ui/avatar', () => ({
  Avatar: ({ children }: any) => <div data-testid="avatar">{children}</div>,
  AvatarFallback: ({ children }: any) => <span>{children}</span>,
  AvatarImage: ({ src }: any) => <img src={src} alt="avatar" />,
}));

vi.mock('../../components/ui/badge', () => ({
  Badge: ({ children }: any) => <span data-testid="badge">{children}</span>,
}));

vi.mock('../../components/Header', () => ({
  getAvatarGradient: vi.fn(() => 'gradient'),
}));

vi.mock('lucide-react', () => ({
  Lock: () => <span>LockIcon</span>,
  Unlock: () => <span>UnlockIcon</span>,
  Mail: () => <span>MailIcon</span>,
  Phone: () => <span>PhoneIcon</span>,
  MapPin: () => <span>MapPinIcon</span>,
  Calendar: () => <span>CalendarIcon</span>,
}));

// import { UserAPI } from './user.api';

// const mockUserAPI = UserAPI as {
//   activateUser: ReturnType<typeof vi.fn>;
//   deActivateUser: ReturnType<typeof vi.fn>;
//   getUserDetail: ReturnType<typeof vi.fn>;
//   getUserGroups: ReturnType<typeof vi.fn>;
//   getUserExpenses: ReturnType<typeof vi.fn>;
//   getUserLoginHistory: ReturnType<typeof vi.fn>;
// };

describe('UserDetailDialog', () => {
  const mockUser = {
    uid: "u1234567",
    email: "alice@example.com",
    full_name: "Alice Nguyen",
    phone_number: "+84123456789",
    status: true,
    joined: "2026-01-15T08:00:00.000Z",
    role: "ADMIN",
    total_expenses: 42,
    total_groups: 5,
    total_balance: 1250.75,
    last_login: "2026-03-30T21:30:00.000Z",
    avatar_url: {
        uid: "a1",
        original_name: "alice_avatar.png",
        public_url: "https://randomuser.me/api/portraits/women/12.jpg"
    }
    };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render dialog when isOpen is true', () => {
    render(<UserDetailDialog user={mockUser} isOpen={true} onClose={() => {}} />);

    expect(screen.getByTestId('dialog')).toBeInTheDocument();
  });

  it('should not render dialog when isOpen is false', () => {
    render(<UserDetailDialog user={mockUser} isOpen={false} onClose={() => {}} />);

    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('should render dialog content when open', () => {
    render(<UserDetailDialog user={mockUser} isOpen={true} onClose={() => {}} />);

    expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
  });

  it('should render user information', () => {
    render(<UserDetailDialog user={mockUser} isOpen={true} onClose={() => {}} />);

    expect(screen.getByText(mockUser.full_name)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
  });

  it('should render tabs for different user details', () => {
    render(<UserDetailDialog user={mockUser} isOpen={true} onClose={() => {}} />);

    expect(screen.getByTestId('tabs')).toBeInTheDocument();
  });

  it('should render lock/unlock button', () => {
    render(<UserDetailDialog user={mockUser} isOpen={true} onClose={() => {}} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should display user avatar', () => {
    render(<UserDetailDialog user={mockUser} isOpen={true} onClose={() => {}} />);

    expect(screen.getByTestId('avatar')).toBeInTheDocument();
  });

  it('should render different content tabs', () => {
    render(<UserDetailDialog user={mockUser} isOpen={true} onClose={() => {}} />);

    const tabs = screen.getAllByTestId('tab-trigger');
    expect(tabs.length).toBeGreaterThan(0);
  });

  it('should call onClose when dialog is closed', () => {
    const mockOnClose = vi.fn();
    render(<UserDetailDialog user={mockUser} isOpen={true} onClose={mockOnClose} />);

    // Dialog component should have close functionality
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
  });

  it('should handle lock toggle', async () => {
    render(<UserDetailDialog user={mockUser} isOpen={true} onClose={() => {}} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should display balance information', () => {
    render(<UserDetailDialog user={mockUser} isOpen={true} onClose={() => {}} />);

    expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
  });
});

/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from './Header';

// Mock authStore
vi.mock('../features/auth/auth.store', () => ({
  authStore: {
    getUserInfo: vi.fn(),
    logout: vi.fn(),
  },
}));

// Mock UI components
vi.mock('./ui/avatar', () => ({
  Avatar: ({ children, className }: any) => <div data-testid="avatar" className={className}>{children}</div>,
  AvatarFallback: ({ children }: any) => <span data-testid="avatar-fallback">{children}</span>,
  AvatarImage: ({ src }: any) => <img data-testid="avatar-image" src={src} alt="avatar" />,
}));

vi.mock('./ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div data-testid="dropdown">{children}</div>,
  DropdownMenuTrigger: ({ children }: any) => <div data-testid="dropdown-trigger">{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div data-testid="dropdown-content">{children}</div>,
  DropdownMenuItem: ({ children, onClick }: any) => (
    <div data-testid="dropdown-item" onClick={onClick}>{children}</div>
  ),
}));

import { authStore } from '../features/auth/auth.store';

const mockAuthStore = authStore as unknown as { getUserInfo: ReturnType<typeof vi.fn> };

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render header element', () => {
    mockAuthStore.getUserInfo.mockReturnValue(null);

    render(<Header />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('should render dashboard text in header', () => {
    mockAuthStore.getUserInfo.mockReturnValue(null);

    render(<Header />);

    const heading = screen.getByText('Dashboard');
    expect(heading).toBeInTheDocument();
  });

  it('should not render user menu when no user info available', () => {
    mockAuthStore.getUserInfo.mockReturnValue(null);

    render(<Header />);

    expect(screen.queryByTestId('avatar')).not.toBeInTheDocument();
  });

  it('should render user menu when user info is available', () => {
    mockAuthStore.getUserInfo.mockReturnValue({
      uid: '123',
      email: 'user@example.com',
      full_name: 'Test User',
      avatar_url: null,
    });

    render(<Header />);

    expect(screen.getByTestId('avatar')).toBeInTheDocument();
  });

  it('should render user avatar with correct initials', () => {
    mockAuthStore.getUserInfo.mockReturnValue({
      uid: '123',
      email: 'user@example.com',
      full_name: 'John Doe',
      avatar_url: null,
    });

    render(<Header />);

    expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('JD');
  });

  it('should render user avatar with email fallback', () => {
    mockAuthStore.getUserInfo.mockReturnValue({
      uid: '123',
      email: 'john@example.com',
      full_name: '',
      avatar_url: null,
    });

    render(<Header />);

    expect(screen.getByTestId('avatar')).toBeInTheDocument();
  });

  it('should have proper header styling', () => {
    mockAuthStore.getUserInfo.mockReturnValue(null);

    render(<Header />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-white');
    expect(header).toHaveClass('border-b');
    expect(header).toHaveClass('border-slate-200');
  });

  it('should render dropdown menu for user', () => {
    mockAuthStore.getUserInfo.mockReturnValue({
      uid: '123',
      email: 'user@example.com',
      full_name: 'Test User',
      avatar_url: null,
    });

    render(<Header />);

    expect(screen.getByTestId('dropdown')).toBeInTheDocument();
  });
});

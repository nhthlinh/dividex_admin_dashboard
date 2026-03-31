/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AdminInviteAcceptPage } from './AdminInviteAcceptPage';

// Mock dependencies
vi.mock('./admin.api', () => ({
  AdminAPI: {
    activateAdmin: vi.fn(),
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: () => [new URLSearchParams('token=test-token-123')],
    useNavigate: () => vi.fn(),
  };
});

vi.mock('../../components/ui/card', () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: any) => <h2 data-testid="card-title">{children}</h2>,
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
}));

vi.mock('../../components/ui/input', () => ({
  Input: ({ value, type, onChange, ...props }: any) => (
    <input value={value} type={type} onChange={onChange} {...props} />
  ),
}));

vi.mock('../../components/ui/button', () => ({
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}));

vi.mock('lucide-react', () => ({
  Lock: () => <span>LockIcon</span>,
}));

import { AdminAPI } from './admin.api';

const mockAdminAPI = AdminAPI as unknown as { activateAdmin: ReturnType<typeof vi.fn> };

describe('AdminInviteAcceptPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

//   it('should render invalid token page when no token in URL', () => {
//     vi.mocked(require('react-router-dom').useSearchParams).mockReturnValueOnce([new URLSearchParams('')]);

//     render(
//       <BrowserRouter>
//         <AdminInviteAcceptPage />
//       </BrowserRouter>
//     );

//     expect(screen.getByTestId('admin-invite-accept-page')).toBeInTheDocument();
//   });

  it('should render form when token is valid', () => {
    render(
      <BrowserRouter>
        <AdminInviteAcceptPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('admin-invite-accept-page')).toBeInTheDocument();
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('should render title for accept invitation', () => {
    render(
      <BrowserRouter>
        <AdminInviteAcceptPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Accept Admin Invitation/i)).toBeInTheDocument();
  });

  it('should render description for password setup', () => {
    render(
      <BrowserRouter>
        <AdminInviteAcceptPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Set your password/i)).toBeInTheDocument();
  });

  it('should have password input fields', () => {
    render(
      <BrowserRouter>
        <AdminInviteAcceptPage />
      </BrowserRouter>
    );

    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThanOrEqual(2);
  });

  it('should render submit button', () => {
    render(
      <BrowserRouter>
        <AdminInviteAcceptPage />
      </BrowserRouter>
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should handle password input changes', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AdminInviteAcceptPage />
      </BrowserRouter>
    );

    const inputs = screen.getAllByRole('textbox');
    await user.type(inputs[0], 'password123');

    expect((inputs[0] as HTMLInputElement).value).toBe('password123');
  });

  it('should call activateAdmin API on form submission', async () => {
    const user = userEvent.setup();
    mockAdminAPI.activateAdmin.mockResolvedValue({});

    render(
      <BrowserRouter>
        <AdminInviteAcceptPage />
      </BrowserRouter>
    );

    const inputs = screen.getAllByRole('textbox');
    const submitButton = screen.getAllByRole('button')[0];

    await user.type(inputs[0], 'password123');
    await user.type(inputs[1], 'password123');
    await user.click(submitButton);

    // After form submission, API should be called
    expect(mockAdminAPI.activateAdmin).toHaveBeenCalled();
  });

  it('should render with proper styling classes', () => {
    render(
      <BrowserRouter>
        <AdminInviteAcceptPage />
      </BrowserRouter>
    );

    const page = screen.getByTestId('admin-invite-accept-page');
    expect(page).toHaveClass('min-h-screen');
    expect(page).toHaveClass('flex');
    expect(page).toHaveClass('items-center');
    expect(page).toHaveClass('justify-center');
  });
});

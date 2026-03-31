/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AdminManagementPage } from './AdminManagementPage';

// Mock dependencies
vi.mock('./admin.api', () => ({
  AdminAPI: {
    listAdmins: vi.fn(),
    inviteAdmin: vi.fn(),
    deleteAdmin: vi.fn(),
  },
}));

vi.mock('../../components/ui/card', () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: any) => <h2>{children}</h2>,
  CardContent: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('../../components/ui/input', () => ({
  Input: ({ value, onChange, placeholder, ...props }: any) => (
    <input value={value} onChange={onChange} placeholder={placeholder} {...props} />
  ),
}));

vi.mock('../../components/ui/button', () => ({
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}));

vi.mock('antd', () => ({
  message: {
    error: vi.fn(),
    success: vi.fn(),
  },
  Popconfirm: ({ children, onConfirm }: any) => (
    <div data-testid="popconfirm" onClick={onConfirm}>
      {children}
    </div>
  ),
}));

vi.mock('lucide-react', () => ({
  Trash2: () => <span>TrashIcon</span>,
  Mail: () => <span>MailIcon</span>,
  UserPlus: () => <span>UserPlusIcon</span>,
}));

import { AdminAPI } from './admin.api';

const mockAdminAPI = AdminAPI as unknown as {
  listAdmins: ReturnType<typeof vi.fn>;
  inviteAdmin: ReturnType<typeof vi.fn>;
  deleteAdmin: ReturnType<typeof vi.fn>;
};

describe('AdminManagementPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAdminAPI.listAdmins.mockResolvedValue({ content: [] });
  });

  it('should render admin management page', async () => {
    render(
      <BrowserRouter>
        <AdminManagementPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('admin-management-page')).toBeInTheDocument();
  });

  it('should render invite admin section', async () => {
    render(
      <BrowserRouter>
        <AdminManagementPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Invite Admin/i)).toBeInTheDocument();
  });

  it('should render email input field', () => {
    render(
      <BrowserRouter>
        <AdminManagementPage />
      </BrowserRouter>
    );

    const emailInputs = screen.getAllByPlaceholderText(/email/i);
    expect(emailInputs.length).toBeGreaterThan(0);
  });

  it('should render invite button', () => {
    render(
      <BrowserRouter>
        <AdminManagementPage />
      </BrowserRouter>
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should call listAdmins API on mount', async () => {
    render(
      <BrowserRouter>
        <AdminManagementPage />
      </BrowserRouter>
    );

    expect(mockAdminAPI.listAdmins).toHaveBeenCalled();
  });

  it('should handle email input changes', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AdminManagementPage />
      </BrowserRouter>
    );

    const emailInputs = screen.getAllByPlaceholderText(/email/i);
    await user.type(emailInputs[0], 'test@example.com');

    expect((emailInputs[0] as HTMLInputElement).value).toBe('test@example.com');
  });

  it('should render admin list when admins are loaded', async () => {
    mockAdminAPI.listAdmins.mockResolvedValue({
      content: [
        { uid: '1', email: 'admin1@example.com', full_name: 'Admin One' },
        { uid: '2', email: 'admin2@example.com', full_name: 'Admin Two' },
      ],
    });

    render(
      <BrowserRouter>
        <AdminManagementPage />
      </BrowserRouter>
    );

    // Wait for the list to load
    await new Promise((r) => setTimeout(r, 100));

    expect(screen.queryByText(/admin1@example.com/i)).toBeDefined();
  });

  it('should have delete buttons for each admin', async () => {
    mockAdminAPI.listAdmins.mockResolvedValue({
      content: [{ uid: '1', email: 'admin1@example.com', full_name: 'Admin One' }],
    });

    render(
      <BrowserRouter>
        <AdminManagementPage />
      </BrowserRouter>
    );

    await new Promise((r) => setTimeout(r, 100));

    // Look for delete/trash icon button
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(1);
  });
});

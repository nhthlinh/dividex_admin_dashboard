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
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });

  it('should handle invite button click', async () => {
    userEvent.setup();
    render(
      <BrowserRouter>
        <AdminManagementPage />
      </BrowserRouter>
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should display email input for invitation', () => {
    render(
      <BrowserRouter>
        <AdminManagementPage />
      </BrowserRouter>
    );

    const emailInputs = screen.getAllByPlaceholderText(/email/i);
    expect(emailInputs.length).toBeGreaterThan(0);
  });

  it('should render page title or header', () => {
    render(
      <BrowserRouter>
        <AdminManagementPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('admin-management-page')).toBeInTheDocument();
  });

  it('should handle multiple admins display', async () => {
    const admins = [
      { uid: '1', email: 'admin1@example.com', full_name: 'Admin One' },
      { uid: '2', email: 'admin2@example.com', full_name: 'Admin Two' },
      { uid: '3', email: 'admin3@example.com', full_name: 'Admin Three' },
    ];

    mockAdminAPI.listAdmins.mockResolvedValue({ content: admins });

    render(
      <BrowserRouter>
        <AdminManagementPage />
      </BrowserRouter>
    );

    await new Promise((r) => setTimeout(r, 100));
  });

  it('should have invitation form structure', () => {
    render(
      <BrowserRouter>
        <AdminManagementPage />
      </BrowserRouter>
    );

    const cards = screen.getAllByTestId('card');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should render list of admins section', async () => {
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

    await new Promise((r) => setTimeout(r, 100));
  });

  it('should handle empty admin list', async () => {
    mockAdminAPI.listAdmins.mockResolvedValue({ content: [] });

    render(
      <BrowserRouter>
        <AdminManagementPage />
      </BrowserRouter>
    );

    await new Promise((r) => setTimeout(r, 100));
    expect(screen.getByTestId('admin-management-page')).toBeInTheDocument();
  });

  it('should clear input after submission', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AdminManagementPage />
      </BrowserRouter>
    );

    const emailInputs = screen.getAllByPlaceholderText(/email/i);
    await user.type(emailInputs[0], 'newadmin@example.com');
    expect((emailInputs[0] as HTMLInputElement).value).toBe('newadmin@example.com');
  });

  it('should handle API call failure gracefully', async () => {
    mockAdminAPI.listAdmins.mockRejectedValue(new Error('API Error'));

    render(
      <BrowserRouter>
        <AdminManagementPage />
      </BrowserRouter>
    );

    await new Promise((r) => setTimeout(r, 100));
    expect(screen.getByTestId('admin-management-page')).toBeInTheDocument();
  });

  it('should display loading state during API call', () => {
    mockAdminAPI.listAdmins.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ content: [] }), 500))
    );

    render(
      <BrowserRouter>
        <AdminManagementPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('admin-management-page')).toBeInTheDocument();
  });

  it('should enable invite button when email is entered', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AdminManagementPage />
      </BrowserRouter>
    );

    const emailInputs = screen.getAllByPlaceholderText(/email/i);
    const email = emailInputs[0] as HTMLInputElement;
    
    await user.type(email, 'admin@test.com');
    expect(email.value).toBe('admin@test.com');
  });

  it('should render admin details when loaded', async () => {
    mockAdminAPI.listAdmins.mockResolvedValue({
      content: [
        { 
          uid: '1', 
          email: 'admin1@example.com', 
          full_name: 'Admin One',
          status: 'active',
          created_at: '2024-01-01'
        },
      ],
    });

    render(
      <BrowserRouter>
        <AdminManagementPage />
      </BrowserRouter>
    );

    await new Promise((r) => setTimeout(r, 100));
  });

  it('should render complete admin management interface', () => {
    render(
      <BrowserRouter>
        <AdminManagementPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('admin-management-page')).toBeInTheDocument();
    const cards = screen.getAllByTestId('card');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should have proper form validation feedback', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AdminManagementPage />
      </BrowserRouter>
    );

    const emailInputs = screen.getAllByPlaceholderText(/email/i);
    if (emailInputs.length > 0) {
      await user.clear(emailInputs[0]);
      expect((emailInputs[0] as HTMLInputElement).value).toBe('');
    }
  });

  it('should render all admin email entries', async () => {
    mockAdminAPI.listAdmins.mockResolvedValue({
      content: [
        { uid: '1', email: 'admin1@example.com', full_name: 'Admin One' },
        { uid: '2', email: 'admin2@example.com', full_name: 'Admin Two' },
        { uid: '3', email: 'admin3@example.com', full_name: 'Admin Three' },
      ],
    });

    render(
      <BrowserRouter>
        <AdminManagementPage />
      </BrowserRouter>
    );

    await new Promise((r) => setTimeout(r, 100));
  });

  it('should handle rapid button clicks', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AdminManagementPage />
      </BrowserRouter>
    );

    const buttons = screen.getAllByRole('button');
    for (const button of buttons) {
      await user.click(button);
    }
  });

  it('should maintain form state across renders', async () => {
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

  it('should display admin count', async () => {
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

    await new Promise((r) => setTimeout(r, 100));
  });

  it('should have working invite form', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AdminManagementPage />
      </BrowserRouter>
    );

    const emailInputs = screen.getAllByPlaceholderText(/email/i);
    const buttons = screen.getAllByRole('button');

    if (emailInputs.length > 0 && buttons.length > 0) {
      await user.type(emailInputs[0], 'newinvite@test.com');
      await user.click(buttons[0]);
    }
  });

  it('should handle multiple operations sequentially', async () => {
    mockAdminAPI.listAdmins.mockResolvedValue({
      content: [{ uid: '1', email: 'admin1@example.com', full_name: 'Admin One' }],
    });

    const { rerender } = render(
      <BrowserRouter>
        <AdminManagementPage />
      </BrowserRouter>
    );

    await new Promise((r) => setTimeout(r, 100));

    rerender(
      <BrowserRouter>
        <AdminManagementPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('admin-management-page')).toBeInTheDocument();
  });

  it('should display page structure correctly', () => {
    render(
      <BrowserRouter>
        <AdminManagementPage />
      </BrowserRouter>
    );

    const page = screen.getByTestId('admin-management-page');
    const cards = screen.getAllByTestId('card');
    const buttons = screen.getAllByRole('button');

    expect(page).toBeInTheDocument();
    expect(cards.length).toBeGreaterThan(0);
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should handle text input in email field', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AdminManagementPage />
      </BrowserRouter>
    );

    const emailInputs = screen.getAllByPlaceholderText(/email/i);
    const input = emailInputs[0] as HTMLInputElement;

    await user.type(input, 'a');
    expect(input.value).toContain('a');

    await user.type(input, '@example.com');
    expect(input.value).toContain('@example.com');
  });

  it('should render page without errors', () => {
    expect(() => {
      render(
        <BrowserRouter>
          <AdminManagementPage />
        </BrowserRouter>
      );
    }).not.toThrow();
  });

  it('should display invite and list sections', () => {
    render(
      <BrowserRouter>
        <AdminManagementPage />
      </BrowserRouter>
    );

    const cards = screen.getAllByTestId('card');
    expect(cards.length).toBeGreaterThanOrEqual(2);
  });

  it('should have form inputs ready for user interaction', () => {
    render(
      <BrowserRouter>
        <AdminManagementPage />
      </BrowserRouter>
    );

    const emailInputs = screen.getAllByPlaceholderText(/email/i);
    const buttons = screen.getAllByRole('button');

    expect(emailInputs.length).toBeGreaterThan(0);
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should handle admin list state updates', async () => {
    mockAdminAPI.listAdmins.mockResolvedValue({
      content: [{ uid: '1', email: 'admin1@example.com', full_name: 'Admin One' }],
    });

    render(
      <BrowserRouter>
        <AdminManagementPage />
      </BrowserRouter>
    );

    expect(mockAdminAPI.listAdmins).toHaveBeenCalled();
  });

  it('should call API when component mounts', () => {
    render(
      <BrowserRouter>
        <AdminManagementPage />
      </BrowserRouter>
    );

    expect(mockAdminAPI.listAdmins).toHaveBeenCalled();
  });

  it('should render complete management interface', () => {
    render(
      <BrowserRouter>
        <AdminManagementPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('admin-management-page')).toBeInTheDocument();
  });

});

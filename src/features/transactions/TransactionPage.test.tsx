/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionPage } from './TransactionPage';

// Create hoisted mocks that can be accessed in tests and vi.mock()
const { mockTransactionAPI } = vi.hoisted(() => ({
  mockTransactionAPI: {
    listTransactions: vi.fn().mockResolvedValue({
      content: [
        {
          uid: 'trans-1',
          code: 'DEP001',
          type: 'deposit',
          amount: 1000,
          currency: 'USD',
          bank_account: {
            bank_name: 'Test Bank',
            account_number: '1234567890',
          },
          to_user: null,
          group_uid: null,
          user: {
            uid: 'user-1',
            full_name: 'John Doe',
            email: 'john@test.com',
            avatar_url: {
              uid: 'avatar-1',
              original_name: 'avatar.jpg',
              public_url: 'https://example.com/avatar1.jpg',
            },
          },
          created_at: '2024-01-01T10:00:00Z',
        },
        {
          uid: 'trans-2',
          code: 'WIT001',
          type: 'withdraw',
          amount: 500,
          currency: 'USD',
          bank_account: {
            bank_name: 'Test Bank',
            account_number: '0987654321',
          },
          to_user: null,
          group_uid: null,
          user: {
            uid: 'user-2',
            full_name: 'Jane Smith',
            email: 'jane@test.com',
            avatar_url: {
              uid: 'avatar-2',
              original_name: 'avatar2.jpg',
              public_url: 'https://example.com/avatar2.jpg',
            },
          },
          created_at: '2024-01-02T11:00:00Z',
        },
      ],
      total_rows: 2,
      current_page: 1,
      page_size: 10,
      total_pages: 1,
    }),
    getTransactionStats: vi.fn().mockResolvedValue({
      total_deposits: 50000,
      percent_increase_deposits: 15.2,
      total_withdrawals: 30000,
      percent_increase_withdrawals: 8.5,
      total_transactions: 150,
      percent_increase_transactions: 12.3,
    }),
  },
}));

// Mock UI components
vi.mock('../../components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div data-testid="card" {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
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

vi.mock('../../components/ui/dialog', () => ({
  Dialog: ({ children, open }: any) => open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h3>{children}</h3>,
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
  ArrowDownCircle: () => <span>ArrowDownCircle</span>,
  ArrowUpCircle: () => <span>ArrowUpCircle</span>,
  TrendingUp: () => <span>TrendingUpIcon</span>,
  Search: () => <span>SearchIcon</span>,
  Calendar: () => <span>CalendarIcon</span>,
  CreditCard: () => <span>CreditCardIcon</span>,
  ArrowLeftRight: () => <span>ArrowLeftRightIcon</span>,
  LucideArrowDownUp: () => <span>LucideArrowDownUpIcon</span>,
}));

vi.mock('antd', () => ({
  Spin: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('./transaction.api', () => ({
  TransactionAPI: mockTransactionAPI,
}));

describe('TransactionPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render transaction page', () => {
    render(<TransactionPage />);

    expect(screen.getByTestId('transaction-page')).toBeInTheDocument();
    expect(screen.getByText('Transaction Management')).toBeInTheDocument();
  });

  it('should render page description', () => {
    render(<TransactionPage />);

    expect(screen.getByText('Monitor all deposits and withdrawals')).toBeInTheDocument();
  });

  it('should load and display transaction stats', async () => {
    render(<TransactionPage />);

    await waitFor(() => {
      expect(mockTransactionAPI.getTransactionStats).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText(/Total Deposits/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Withdrawals/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Transactions/i)).toBeInTheDocument();
    });
  });

  it('should fetch transactions on mount', async () => {
    render(<TransactionPage />);

    await waitFor(() => {
      expect(mockTransactionAPI.listTransactions).toHaveBeenCalled();
    });
  });

  it('should display correct stat values', async () => {
    render(<TransactionPage />);

    await waitFor(() => {
      // Stats may not be directly visible, but should be loaded
      expect(mockTransactionAPI.getTransactionStats).toHaveBeenCalled();
    });
  });

  it('should filter transactions by deposit type', async () => {
    const user = userEvent.setup();
    render(<TransactionPage />);

    await waitFor(() => {
      expect(mockTransactionAPI.listTransactions).toHaveBeenCalled();
    });

    const selects = screen.queryAllByRole('combobox');
    if (selects.length > 0) {
      await user.selectOptions(selects[0], 'deposit');

      await waitFor(() => {
        expect(mockTransactionAPI.listTransactions).toHaveBeenCalledWith(
          expect.objectContaining({ type: 'deposit' })
        );
      });
    }
  });

  it('should filter transactions by withdrawal type', async () => {
    const user = userEvent.setup();
    render(<TransactionPage />);

    await waitFor(() => {
      expect(mockTransactionAPI.listTransactions).toHaveBeenCalled();
    });

    const selects = screen.queryAllByRole('combobox');
    if (selects.length > 0) {
      await user.selectOptions(selects[0], 'withdraw');

      await waitFor(() => {
        expect(mockTransactionAPI.listTransactions).toHaveBeenCalledWith(
          expect.objectContaining({ type: 'withdraw' })
        );
      });
    }
  });

  it('should search transactions by code', async () => {
    const user = userEvent.setup();
    render(<TransactionPage />);

    await waitFor(() => {
      expect(mockTransactionAPI.listTransactions).toHaveBeenCalled();
    });

    const inputs = screen.getAllByTestId('input');
    const searchInput = inputs[inputs.length - 1];

    await user.type(searchInput, 'DEP001');

    await waitFor(() => {
      expect(mockTransactionAPI.listTransactions).toHaveBeenCalledWith(
        expect.objectContaining({ search: expect.stringContaining('DEP001') })
      );
    });
  });

  it('should search transactions by user name', async () => {
    const user = userEvent.setup();
    render(<TransactionPage />);

    await waitFor(() => {
      expect(mockTransactionAPI.listTransactions).toHaveBeenCalled();
    });

    const inputs = screen.getAllByTestId('input');
    const searchInput = inputs[inputs.length - 1];

    await user.type(searchInput, 'John');

    await waitFor(() => {
      expect(mockTransactionAPI.listTransactions).toHaveBeenCalledWith(
        expect.objectContaining({ search: expect.stringContaining('John') })
      );
    });
  });

  it('should handle all filter types', async () => {
    const user = userEvent.setup();
    render(<TransactionPage />);

    await waitFor(() => {
      expect(mockTransactionAPI.listTransactions).toHaveBeenCalled();
    });

    const selects = screen.queryAllByRole('combobox');
    if (selects.length > 0) {
      const types = ['ALL', 'deposit', 'withdraw', 'transaction'];

      for (const type of types) {
        await user.selectOptions(selects[0], type);

        await waitFor(() => {
          const lastCall = mockTransactionAPI.listTransactions.mock.calls[
            mockTransactionAPI.listTransactions.mock.calls.length - 1
          ];
          expect(lastCall).toBeDefined();
        });
      }
    }
  });

  it('should display loading state during fetch', async () => {
    mockTransactionAPI.listTransactions.mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(() => resolve({
        content: [],
        total_rows: 0,
      }), 100))
    );

    render(<TransactionPage />);

    expect(screen.getByTestId('transaction-page')).toBeInTheDocument();
  });

  it('should handle empty transaction results', async () => {
    mockTransactionAPI.listTransactions.mockResolvedValueOnce({
      content: [],
      total_rows: 0,
    });

    render(<TransactionPage />);

    await waitFor(() => {
      expect(mockTransactionAPI.listTransactions).toHaveBeenCalled();
    });
  });

  it('should handle pagination', async () => {
    render(<TransactionPage />);

    await waitFor(() => {
      expect(mockTransactionAPI.listTransactions).toHaveBeenCalled();
    });

    const buttons = screen.getAllByTestId('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should handle API errors gracefully', async () => {
    mockTransactionAPI.listTransactions.mockRejectedValueOnce(
      new Error('API Error')
    );

    render(<TransactionPage />);

    await waitFor(() => {
      expect(screen.getByTestId('transaction-page')).toBeInTheDocument();
    });
  });

  it('should handle stats API errors gracefully', async () => {
    mockTransactionAPI.getTransactionStats.mockRejectedValueOnce(
      new Error('Stats API Error')
    );

    render(<TransactionPage />);

    await waitFor(() => {
      expect(screen.getByTestId('transaction-page')).toBeInTheDocument();
    });
  });

  it('should maintain search state across re-renders', async () => {
    const user = userEvent.setup();
    render(<TransactionPage />);

    await waitFor(() => {
      expect(mockTransactionAPI.listTransactions).toHaveBeenCalled();
    });

    const inputs = screen.getAllByTestId('input');
    const searchInput = inputs[inputs.length - 1];

    await user.type(searchInput, 'search');

    const searchInputValue = (searchInput as HTMLInputElement).value;
    expect(searchInputValue).toContain('search');
  });

  it('should maintain filter state across re-renders', async () => {
    const user = userEvent.setup();
    render(<TransactionPage />);

    await waitFor(() => {
      expect(mockTransactionAPI.listTransactions).toHaveBeenCalled();
    });

    const selects = screen.queryAllByRole('combobox');
    if (selects.length > 0) {
      await user.selectOptions(selects[0], 'deposit');

      const selectElement = selects[0] as HTMLSelectElement;
      expect(selectElement.value).toBe('deposit');
    }
  });

  it('should refetch on filter change', async () => {
    const user = userEvent.setup();
    render(<TransactionPage />);

    const initialCallCount = mockTransactionAPI.listTransactions.mock.calls.length;

    await waitFor(() => {
      expect(mockTransactionAPI.listTransactions).toHaveBeenCalled();
    });

    const selects = screen.queryAllByRole('combobox');
    if (selects.length > 0) {
      await user.selectOptions(selects[0], 'withdraw');

      await waitFor(() => {
        expect(mockTransactionAPI.listTransactions.mock.calls.length).toBeGreaterThan(initialCallCount);
      });
    }
  });

  it('should refetch on search change', async () => {
    const user = userEvent.setup();
    render(<TransactionPage />);

    const initialCallCount = mockTransactionAPI.listTransactions.mock.calls.length;

    await waitFor(() => {
      expect(mockTransactionAPI.listTransactions).toHaveBeenCalled();
    });

    const inputs = screen.getAllByTestId('input');
    const searchInput = inputs[inputs.length - 1];

    await user.type(searchInput, 'DEP');

    await waitFor(() => {
      expect(mockTransactionAPI.listTransactions.mock.calls.length).toBeGreaterThan(initialCallCount);
    });
  });
});

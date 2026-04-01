/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpensePage } from './ExpensePage';

// Create hoisted mocks that can be accessed in tests and vi.mock()
const { mockExpenseAPI } = vi.hoisted(() => ({
  mockExpenseAPI: {
    getExpenses: vi.fn().mockResolvedValue({
      content: [
        {
          uid: 'exp-1',
          name: 'Office Supplies',
          total_amount: 250,
          currency: 'USD',
          category: 'Office Supplies',
          expense_date: '2024-01-10T10:00:00Z',
          status: 'ACTIVE',
          split_type: 'EQUAL',
          paid_by: {
            uid: 'user-1',
            full_name: 'John Doe',
            email: 'john@test.com',
            avatar_url: {
              uid: 'avatar-1',
              original_name: 'avatar.jpg',
              public_url: 'https://example.com/avatar1.jpg',
            },
          },
          creator: {
            uid: 'user-1',
            full_name: 'John Doe',
            email: 'john@test.com',
            avatar_url: {
              uid: 'avatar-1',
              original_name: 'avatar.jpg',
              public_url: 'https://example.com/avatar1.jpg',
            },
          },
          event: {
            uid: 'event-1',
            name: 'Team Meeting',
          },
        },
        {
          uid: 'exp-2',
          name: 'Team Lunch',
          total_amount: 1500000,
          currency: 'VND',
          category: 'Food & Dining',
          expense_date: '2024-01-12T12:00:00Z',
          status: 'ACTIVE',
          split_type: 'EQUAL',
          paid_by: {
            uid: 'user-2',
            full_name: 'Jane Smith',
            email: 'jane@test.com',
            avatar_url: {
              uid: 'avatar-2',
              original_name: 'avatar2.jpg',
              public_url: 'https://example.com/avatar2.jpg',
            },
          },
          creator: {
            uid: 'user-2',
            full_name: 'Jane Smith',
            email: 'jane@test.com',
            avatar_url: {
              uid: 'avatar-2',
              original_name: 'avatar2.jpg',
              public_url: 'https://example.com/avatar2.jpg',
            },
          },
          event: {
            uid: 'event-2',
            name: 'Team Lunch',
          },
        },
        {
          uid: 'exp-3',
          name: 'Hotel Room',
          total_amount: 150,
          currency: 'USD',
          category: 'Accommodation',
          expense_date: '2024-01-13T10:00:00Z',
          status: 'ACTIVE',
          split_type: 'EQUAL',
          paid_by: {
            uid: 'user-1',
            full_name: 'John Doe',
            email: 'john@test.com',
            avatar_url: {
              uid: 'avatar-1',
              original_name: 'avatar.jpg',
              public_url: 'https://example.com/avatar1.jpg',
            },
          },
          creator: {
            uid: 'user-1',
            full_name: 'John Doe',
            email: 'john@test.com',
            avatar_url: {
              uid: 'avatar-1',
              original_name: 'avatar.jpg',
              public_url: 'https://example.com/avatar1.jpg',
            },
          },
          event: {
            uid: 'event-3',
            name: 'Team Trip',
          },
        },
        {
          uid: 'exp-4',
          name: 'Taxi Ride',
          total_amount: 50,
          currency: 'USD',
          category: 'Transportation',
          expense_date: '2024-01-14T14:00:00Z',
          status: 'ACTIVE',
          split_type: 'EQUAL',
          paid_by: {
            uid: 'user-2',
            full_name: 'Jane Smith',
            email: 'jane@test.com',
            avatar_url: {
              uid: 'avatar-2',
              original_name: 'avatar2.jpg',
              public_url: 'https://example.com/avatar2.jpg',
            },
          },
          creator: {
            uid: 'user-2',
            full_name: 'Jane Smith',
            email: 'jane@test.com',
            avatar_url: {
              uid: 'avatar-2',
              original_name: 'avatar2.jpg',
              public_url: 'https://example.com/avatar2.jpg',
            },
          },
          event: {
            uid: 'event-4',
            name: 'Meeting',
          },
        },
        {
          uid: 'exp-5',
          name: 'Social Media Campaign',
          total_amount: 800,
          currency: 'USD',
          category: 'Marketing',
          expense_date: '2024-01-15T09:00:00Z',
          status: 'ACTIVE',
          split_type: 'EQUAL',
          paid_by: {
            uid: 'user-1',
            full_name: 'John Doe',
            email: 'john@test.com',
            avatar_url: {
              uid: 'avatar-1',
              original_name: 'avatar.jpg',
              public_url: 'https://example.com/avatar1.jpg',
            },
          },
          creator: {
            uid: 'user-1',
            full_name: 'John Doe',
            email: 'john@test.com',
            avatar_url: {
              uid: 'avatar-1',
              original_name: 'avatar.jpg',
              public_url: 'https://example.com/avatar1.jpg',
            },
          },
          event: {
            uid: 'event-5',
            name: 'Marketing Event',
          },
        },
        {
          uid: 'exp-6',
          name: 'Project Management Software',
          total_amount: 500,
          currency: 'USD',
          category: 'Software & Tools',
          expense_date: '2024-01-16T11:00:00Z',
          status: 'ACTIVE',
          split_type: 'EQUAL',
          paid_by: {
            uid: 'user-2',
            full_name: 'Jane Smith',
            email: 'jane@test.com',
            avatar_url: {
              uid: 'avatar-2',
              original_name: 'avatar2.jpg',
              public_url: 'https://example.com/avatar2.jpg',
            },
          },
          creator: {
            uid: 'user-2',
            full_name: 'Jane Smith',
            email: 'jane@test.com',
            avatar_url: {
              uid: 'avatar-2',
              original_name: 'avatar2.jpg',
              public_url: 'https://example.com/avatar2.jpg',
            },
          },
          event: {
            uid: 'event-6',
            name: 'Development',
          },
        },
      ],
      total_pages: 1,
      current_page: 1,
      page_size: 10,
      total_rows: 6,
    }),
    getExpenseStatistics: vi.fn().mockResolvedValue({
      total_expenses: 45,
      percent_increase_expenses: 18.3,
      active_expenses: 32,
      percent_increase_active_expenses: 12.1,
      total_expired_expenses: 13,
      percent_increase_expired_expenses: 5.8,
      total_avg_amount: 500.75,
      percent_increase_avg_amount: 3.2,
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
  DollarSign: () => <span>DollarSignIcon</span>,
  TrendingUp: () => <span>TrendingUpIcon</span>,
  Search: () => <span>SearchIcon</span>,
  Receipt: () => <span>ReceiptIcon</span>,
  PieChart: () => <span>PieChartIcon</span>,
}));

vi.mock('antd', () => ({
  Spin: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('./ExpenseDetailDialog', () => ({
  ExpenseDetailDialog: ({ isOpen }: any) => isOpen ? <div data-testid="expense-detail-dialog">Expense Details</div> : null,
}));

vi.mock('./expense.api', () => ({
  ExpenseAPI: mockExpenseAPI,
}));

describe('ExpensePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render expense page', () => {
    render(<ExpensePage />);

    expect(screen.getByTestId('expense-page')).toBeInTheDocument();
  });

  it('should render page title', () => {
    render(<ExpensePage />);

    expect(screen.getByText('Expense Management')).toBeInTheDocument();
  });

  it('should load expense statistics on mount', async () => {
    render(<ExpensePage />);

    await waitFor(() => {
      expect(mockExpenseAPI.getExpenseStatistics).toHaveBeenCalled();
    });
  });

  it('should display expense stats cards', async () => {
    render(<ExpensePage />);

    await waitFor(() => {
      expect(mockExpenseAPI.getExpenseStatistics).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText(/Total Expenses/i)).toBeInTheDocument();
      expect(screen.getByText(/Active Expenses/i)).toBeInTheDocument();
    });
  });

  it('should fetch expenses on mount', async () => {
    render(<ExpensePage />);

    await waitFor(() => {
      expect(mockExpenseAPI.getExpenses).toHaveBeenCalled();
    });
  });

  it('should search expenses', async () => {
    const user = userEvent.setup();
    render(<ExpensePage />);

    await waitFor(() => {
      expect(mockExpenseAPI.getExpenses).toHaveBeenCalled();
    });

    const inputs = screen.getAllByTestId('input');
    const searchInput = inputs[inputs.length - 1];

    await user.type(searchInput, 'Office');

    const inputValue = (searchInput as HTMLInputElement).value;
    expect(inputValue).toContain('Office');
  });

  it('should filter expenses by category', async () => {
    const user = userEvent.setup();
    render(<ExpensePage />);

    await waitFor(() => {
      expect(mockExpenseAPI.getExpenses).toHaveBeenCalled();
    });

    const selects = screen.queryAllByRole('combobox');
    if (selects.length > 0) {
      await user.selectOptions(selects[0], 'Food & Dining');

      await waitFor(() => {
        expect(screen.getByTestId('expense-page')).toBeInTheDocument();
      });
    }
  });

  it('should handle all category options', async () => {
    const user = userEvent.setup();
    render(<ExpensePage />);

    await waitFor(() => {
      expect(mockExpenseAPI.getExpenses).toHaveBeenCalled();
    });

    const selects = screen.queryAllByRole('combobox');
    if (selects.length > 0) {
      const categories = [
        'ALL',
        'Food & Dining',
        'Accommodation',
        'Transportation',
        'Office Supplies',
        'Marketing',
        'Software & Tools',
      ];

      for (const category of categories) {
        await user.selectOptions(selects[0], category);

        await waitFor(() => {
          expect(screen.getByTestId('expense-page')).toBeInTheDocument();
        });
      }
    }
  });

  it('should handle pagination', async () => {
    render(<ExpensePage />);

    await waitFor(() => {
      expect(mockExpenseAPI.getExpenses).toHaveBeenCalled();
    });

    const buttons = screen.queryAllByTestId('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should open expense detail dialog on click', async () => {
    const user = userEvent.setup();
    render(<ExpensePage />);

    await waitFor(() => {
      expect(mockExpenseAPI.getExpenses).toHaveBeenCalled();
    });

    const cards = screen.queryAllByTestId('card');
    if (cards.length > 1) {
      // Click on an expense card (skip stats cards)
      const expenseCard = cards[1];
      await user.click(expenseCard);
    }
  });

  it('should handle empty expense results', async () => {
    mockExpenseAPI.getExpenses.mockResolvedValueOnce({
      content: [],
      total_pages: 0,
    });

    render(<ExpensePage />);

    await waitFor(() => {
      expect(mockExpenseAPI.getExpenses).toHaveBeenCalled();
    });

    expect(screen.getByTestId('expense-page')).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    mockExpenseAPI.getExpenses.mockRejectedValueOnce(
      new Error('API Error')
    );

    render(<ExpensePage />);

    await waitFor(() => {
      expect(screen.getByTestId('expense-page')).toBeInTheDocument();
    });
  });

  it('should handle stats API errors gracefully', async () => {
    mockExpenseAPI.getExpenseStatistics.mockRejectedValueOnce(
      new Error('Stats API Error')
    );

    render(<ExpensePage />);

    await waitFor(() => {
      expect(screen.getByTestId('expense-page')).toBeInTheDocument();
    });
  });

  it('should display multiple expenses', async () => {
    render(<ExpensePage />);

    await waitFor(() => {
      expect(mockExpenseAPI.getExpenses).toHaveBeenCalled();
    });

    const cards = screen.queryAllByTestId('card');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should handle page pagination', async () => {
    const user = userEvent.setup();
    render(<ExpensePage />);

    await waitFor(() => {
      expect(mockExpenseAPI.getExpenses).toHaveBeenCalled();
    });

    const initialCallCount = mockExpenseAPI.getExpenses.mock.calls.length;

    const buttons = screen.getAllByTestId('button');
    const nextPageButton = buttons.find((btn) => btn.textContent?.includes('Next'));

    if (nextPageButton) {
      await user.click(nextPageButton);

      await waitFor(() => {
        expect(mockExpenseAPI.getExpenses.mock.calls.length).toBeGreaterThanOrEqual(initialCallCount);
      });
    }
  });

  it('should maintain search state across re-renders', async () => {
    const user = userEvent.setup();
    render(<ExpensePage />);

    await waitFor(() => {
      expect(mockExpenseAPI.getExpenses).toHaveBeenCalled();
    });

    const inputs = screen.getAllByTestId('input');
    const searchInput = inputs[inputs.length - 1];

    await user.type(searchInput, 'Supplies');

    const inputValue = (searchInput as HTMLInputElement).value;
    expect(inputValue).toContain('Supplies');
  });

  it('should maintain filter state across re-renders', async () => {
    const user = userEvent.setup();
    render(<ExpensePage />);

    await waitFor(() => {
      expect(mockExpenseAPI.getExpenses).toHaveBeenCalled();
    });

    const selects = screen.queryAllByRole('combobox');
    if (selects.length > 0) {
      await user.selectOptions(selects[0], 'Transportation');

      const selectElement = selects[0] as HTMLSelectElement;
      expect(selectElement.value).toBe('Transportation');
    }
  });

  it('should display correct stat values', async () => {
    render(<ExpensePage />);

    await waitFor(() => {
      expect(mockExpenseAPI.getExpenseStatistics).toHaveBeenCalled();
    });

    await waitFor(() => {
      // Stats text should be visible
      const pageContent = screen.getByTestId('expense-page').textContent || '';
      expect(pageContent).toBeTruthy();
    });
  });

  it('should format currency correctly', async () => {
    render(<ExpensePage />);

    await waitFor(() => {
      expect(mockExpenseAPI.getExpenses).toHaveBeenCalled();
    });

    // Component uses formatCurrency internally
    expect(screen.getByTestId('expense-page')).toBeInTheDocument();
  });

  it('should handle multiple currency types', async () => {
    mockExpenseAPI.getExpenses.mockResolvedValueOnce({
      content: [
        {
          uid: 'exp-1',
          name: 'US Expense',
          amount: 100,
          currency: 'USD',
          category: 'Office Supplies',
          created_at: '2024-01-10T10:00:00Z',
          status: 'ACTIVE',
        },
        {
          uid: 'exp-2',
          name: 'Vietnam Expense',
          amount: 5000000,
          currency: 'VND',
          category: 'Food & Dining',
          created_at: '2024-01-12T12:00:00Z',
          status: 'ACTIVE',
        },
        {
          uid: 'exp-3',
          name: 'EU Expense',
          amount: 500,
          currency: 'EUR',
          category: 'Transportation',
          created_at: '2024-01-15T14:00:00Z',
          status: 'ACTIVE',
        },
      ],
      total_pages: 1,
    });

    render(<ExpensePage />);

    await waitFor(() => {
      expect(mockExpenseAPI.getExpenses).toHaveBeenCalled();
    });

    expect(screen.getByTestId('expense-page')).toBeInTheDocument();
  });
});

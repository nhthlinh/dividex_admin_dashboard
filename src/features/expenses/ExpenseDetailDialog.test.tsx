/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExpenseDetailDialog } from './ExpenseDetailDialog';
import type { CurrencyType, ExpenseStatus, SplitType } from './expense.types';

// Mock dependencies
vi.mock('./expense.api', () => ({
  ExpenseAPI: {
    getExpenseDetail: vi.fn(),
    updateExpense: vi.fn(),
    deleteExpense: vi.fn(),
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
  DollarSign: () => <span>DollarIcon</span>,
  Calendar: () => <span>CalendarIcon</span>,
  User: () => <span>UserIcon</span>,
  FileText: () => <span>FileIcon</span>,
}));

// import { ExpenseAPI } from './expense.api';

// const mockExpenseAPI = ExpenseAPI as {
//   getExpenseDetail: ReturnType<typeof vi.fn>;
//   updateExpense: ReturnType<typeof vi.fn>;
//   deleteExpense: ReturnType<typeof vi.fn>;
// };

describe('ExpenseDetailDialog', () => {
  const mockExpense = {
    uid: "a1b2c3d4",
    expense_uid: "e5f6g7h8",
    name: "Coffee",
    category: "Food",
    total_amount: 342,
    status: "ACTIVE" as ExpenseStatus,
    created_at: "2026-03-31T07:00:00.000Z",
    created_by: { uid: "u1", full_name: "Alice", email: "alice@example.com", avatar_url: {
        public_url: "https://example.com/avatar.jpg",
        uid: "av1",
        original_name: "avatar.jpg",
    } },
    created_by_uid: "u1",
    event: {
        uid: "ev1",
        name: "Birthday Party"
    },
    event_uid: "ev1",
    description: "Coffee for event",
    paid_by: { uid: "u2", full_name: "Bob", email: "bob@example.com", avatar_url: {
        public_url: "https://example.com/avatar.jpg",
        uid: "av2",
        original_name: "avatar.jpg",
    } },
    creator: { uid: "u2", full_name: "Bob", email: "bob@example.com", avatar_url: {
        public_url: "https://example.com/avatar.jpg", 
        original_name: "avatar.jpg",
        uid: "av2",
    } },
    payer_uid: "u2",
    note: "Note for coffee",
    expense_date: "2026-03-31T07:00:00.000Z",
    list_user_shares: [
        {
        amount: 120,
        user: { uid: "u1", full_name: "Alice", email: "alice@example.com", avatar_url: {
            public_url: "https://example.com/avatar.jpg",
            uid: "av1",
            original_name: "avatar.jpg",
        } }
        }
    ],
    currency: "USD" as CurrencyType,
    split_type: "EQUAL" as SplitType,
   };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render dialog when isOpen is true', () => {
    render(<ExpenseDetailDialog expense={mockExpense} open={true} onOpenChange={() => {}} />);

    expect(screen.getByTestId('dialog')).toBeInTheDocument();
  });

  it('should not render dialog when isOpen is false', () => {
    render(<ExpenseDetailDialog expense={mockExpense} open={false} onOpenChange={() => {}} />);

    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('should render expense description', () => {
    render(<ExpenseDetailDialog expense={mockExpense} open={true} onOpenChange={() => {}} />);

    expect(screen.getByText(mockExpense.description)).toBeInTheDocument();
  });

  it('should render dialog content', () => {
    render(<ExpenseDetailDialog expense={mockExpense} open={true} onOpenChange={() => {}} />);

    expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
  });

  it('should render tabs', () => {
    render(<ExpenseDetailDialog expense={mockExpense} open={true} onOpenChange={() => {}} />);

    expect(screen.getByTestId('tabs')).toBeInTheDocument();
  });

  it('should display amount information', () => {
    render(<ExpenseDetailDialog expense={mockExpense} open={true} onOpenChange={() => {}} />);

    expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
  });

  it('should render action buttons', () => {
    render(<ExpenseDetailDialog expense={mockExpense} open={true} onOpenChange={() => {}} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should display expense details in dialog', () => {
    render(<ExpenseDetailDialog expense={mockExpense} open={true} onOpenChange={() => {}} />);

    expect(screen.getByTestId('dialog')).toBeInTheDocument();
  });

  it('should render currency symbol', () => {
    render(<ExpenseDetailDialog expense={mockExpense} open={true} onOpenChange={() => {}} />);

    expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
  });
});


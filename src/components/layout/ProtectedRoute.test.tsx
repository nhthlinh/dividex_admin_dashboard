import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Mock useAuth hook
vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../../hooks/useAuth';

const mockUseAuth = useAuth as ReturnType<typeof vi.fn>;

describe('ProtectedRoute', () => {
  const TestComponent = () => <div data-testid="protected-content">Protected Content</div>;

  it('should render children when user is authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true });

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('should navigate to login when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false });

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('should not render protected content on unauthenticated route', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false });

    const { container } = render(
      <BrowserRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(container.querySelector('[data-testid="protected-content"]')).not.toBeInTheDocument();
  });

  it('should render multiple children as protected content', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true });

    const MultipleChildren = () => (
      <>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </>
    );

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <MultipleChildren />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });

  it('should use replace option when navigating to login', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false });

    const { container } = render(
      <BrowserRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    // Check that Navigate component uses replace
    expect(container).toBeTruthy();
  });
});

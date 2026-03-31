/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminLayout from './AdminLayout';

// Mock child components
vi.mock('../Sidebar', () => ({
  Sidebar: ({ 'data-testid': testId, currentPage }: any) => (
    <nav data-testid={testId}>{currentPage}</nav>
  ),
}));

vi.mock('../Header', () => ({
  Header: ({ 'data-testid': testId }: any) => <header data-testid={testId}>Header</header>,
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">Outlet Content</div>,
  };
});

// Mock window.location
delete (window as any).location;
(window as any).location = { pathname: '/' };

describe('AdminLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (window as any).location.pathname = '/';
  });

  it('should render layout with all components', () => {
    render(
      <BrowserRouter>
        <AdminLayout />
      </BrowserRouter>
    );

    expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
    expect(screen.getByTestId('admin-header')).toBeInTheDocument();
    expect(screen.getByTestId('admin-nav')).toBeInTheDocument();
    expect(screen.getByTestId('admin-main')).toBeInTheDocument();
  });

  it('should render Outlet for page content', () => {
    render(
      <BrowserRouter>
        <AdminLayout />
      </BrowserRouter>
    );

    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('should set currentPage to dashboard when pathname is /', () => {
    (window as any).location.pathname = '/';
    render(
      <BrowserRouter>
        <AdminLayout />
      </BrowserRouter>
    );

    expect(screen.getByTestId('admin-nav')).toHaveTextContent('dashboard');
  });

  it('should set currentPage from pathname', () => {
    (window as any).location.pathname = '/user';
    render(
      <BrowserRouter>
        <AdminLayout />
      </BrowserRouter>
    );

    expect(screen.getByTestId('admin-nav')).toHaveTextContent('user');
  });

  it('should have main element for content', () => {
    render(
      <BrowserRouter>
        <AdminLayout />
      </BrowserRouter>
    );

    const mainElement = screen.getByTestId('admin-main');
    expect(mainElement.tagName).toBe('MAIN');
  });

  it('should contain outlet in main element', () => {
    render(
      <BrowserRouter>
        <AdminLayout />
      </BrowserRouter>
    );

    const mainElement = screen.getByTestId('admin-main');
    const outlet = screen.getByTestId('outlet');
    expect(mainElement.contains(outlet)).toBe(true);
  });

  it('should have proper CSS classes', () => {
    render(
      <BrowserRouter>
        <AdminLayout />
      </BrowserRouter>
    );

    const layout = screen.getByTestId('admin-layout');
    expect(layout).toHaveClass('bg-slate-50');
    expect(layout).toHaveClass('overflow-hidden');
  });
});

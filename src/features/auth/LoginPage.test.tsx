/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';

// Mock dependencies
vi.mock('./auth.api', () => ({
  AuthAPI: {
    login: vi.fn(),
  },
}));

vi.mock('./auth.store', () => ({
  authStore: {
    setToken: vi.fn(),
    setUserInfo: vi.fn(),
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('antd', () => ({
  Button: ({ children, loading, onClick, ...props }: any) => (
    <button data-testid="login-button" disabled={loading} onClick={onClick} {...props}>
      {children || 'Login'}
    </button>
  ),
  Input: Object.assign(
    ({ value, placeholder, onChange, ...props }: any) => (
      <input data-testid={`input-${placeholder}`} value={value} placeholder={placeholder} onChange={onChange} {...props} />
    ),
    {
      Password: ({ value, placeholder, onChange, ...props }: any) => (
        <input
          data-testid={`input-${placeholder}`}
          type="password"
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          {...props}
        />
      ),
    }
  ),
  message: {
    warning: vi.fn(),
    error: vi.fn(),
    success: vi.fn(),
  },
}));

import { AuthAPI } from './auth.api';
import { authStore } from './auth.store';

const mockAuthAPI = AuthAPI as { login: ReturnType<typeof vi.fn> };
const mockAuthStore = authStore as unknown as { setToken: ReturnType<typeof vi.fn>; setUserInfo: ReturnType<typeof vi.fn> };

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login page', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('should render email and password input fields', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('input-Email')).toBeInTheDocument();
    expect(screen.getByTestId('input-Password')).toBeInTheDocument();
  });

  it('should render login button', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('login-button')).toBeInTheDocument();
  });

  it('should render title and description', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Dividex Admin Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Secure platform to manage users and system settings')).toBeInTheDocument();
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
  });

  it('should update email state on input change', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByTestId('input-Email') as HTMLInputElement;
    await user.type(emailInput, 'test@example.com');

    expect(emailInput.value).toBe('test@example.com');
  });

  it('should update password state on input change', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const passwordInput = screen.getByTestId('input-Password') as HTMLInputElement;
    await user.type(passwordInput, 'password123');

    expect(passwordInput.value).toBe('password123');
  });

  it('should call login API on successful form submission', async () => {
    const user = userEvent.setup();
    mockAuthAPI.login.mockResolvedValue({
      access_token: 'token123',
      user: { uid: '1', email: 'test@example.com', full_name: 'Test User' },
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByTestId('input-Email');
    const passwordInput = screen.getByTestId('input-Password');
    const loginButton = screen.getByTestId('login-button');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(loginButton);

    expect(mockAuthAPI.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('should set token and user info on successful login', async () => {
    const user = userEvent.setup();
    mockAuthAPI.login.mockResolvedValue({
      access_token: 'token123',
      user: { uid: '1', email: 'test@example.com', full_name: 'Test User' },
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByTestId('input-Email');
    const passwordInput = screen.getByTestId('input-Password');
    const loginButton = screen.getByTestId('login-button');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(loginButton);

    expect(mockAuthStore.setToken).toHaveBeenCalledWith('token123');
    expect(mockAuthStore.setUserInfo).toHaveBeenCalled();
  });

  it('should render required styled elements', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const loginPage = screen.getByTestId('login-page');
    expect(loginPage).toHaveStyle({ height: '100vh', display: 'flex' });
  });

  it('should render logo image', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Logo should be present as an image
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });
});

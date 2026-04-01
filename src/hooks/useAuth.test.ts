import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from './useAuth';

// Mock authStore
vi.mock('../features/auth/auth.store', () => ({
  authStore: {
    isAuthenticated: vi.fn(),
  },
}));

import { authStore } from '../features/auth/auth.store';

const mockAuthStore = authStore as unknown as { isAuthenticated: ReturnType<typeof vi.fn> };

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return isAuthenticated true when user is authenticated', () => {
    mockAuthStore.isAuthenticated.mockReturnValue(true);

    const { isAuthenticated } = useAuth();

    expect(isAuthenticated).toBe(true);
  });

  it('should return isAuthenticated false when user is not authenticated', () => {
    mockAuthStore.isAuthenticated.mockReturnValue(false);

    const { isAuthenticated } = useAuth();

    expect(isAuthenticated).toBe(false);
  });

  it('should call authStore.isAuthenticated on each invocation', () => {
    mockAuthStore.isAuthenticated.mockReturnValue(true);

    useAuth();
    useAuth();

    expect(mockAuthStore.isAuthenticated).toHaveBeenCalledTimes(2);
  });

  it('should return object with isAuthenticated property', () => {
    mockAuthStore.isAuthenticated.mockReturnValue(true);

    const result = useAuth();

    expect(result).toHaveProperty('isAuthenticated');
    expect(typeof result.isAuthenticated).toBe('boolean');
  });

  it('should work correctly on multiple calls', () => {
    mockAuthStore.isAuthenticated
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    const first = useAuth();
    const second = useAuth();
    const third = useAuth();

    expect(first.isAuthenticated).toBe(true);
    expect(second.isAuthenticated).toBe(false);
    expect(third.isAuthenticated).toBe(true);
  });
});

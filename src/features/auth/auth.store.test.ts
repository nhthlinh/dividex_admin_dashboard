import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { authStore } from './auth.store';

describe('authStore', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('setToken', () => {
    it('should set token in localStorage', () => {
      authStore.setToken('token123');

      expect(localStorage.getItem('admin_token')).toBe('token123');
    });

    it('should overwrite existing token', () => {
      authStore.setToken('token1');
      authStore.setToken('token2');

      expect(localStorage.getItem('admin_token')).toBe('token2');
    });
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      authStore.setToken('token123');

      const token = authStore.getToken();

      expect(token).toBe('token123');
    });

    it('should return null when no token exists', () => {
      const token = authStore.getToken();

      expect(token).toBeNull();
    });
  });

  describe('setUserInfo', () => {
    it('should set user info in localStorage', () => {
      const user = { uid: '123', email: 'test@example.com', full_name: 'Test User', avatar_url:  {
        public_url: 'http://example.com/avatar.jpg',
        origin_name: '',
        uid: 'avatar123',
      }};

      authStore.setUserInfo(user);

      expect(localStorage.getItem('admin_user_info')).toBe(JSON.stringify(user));
    });

    it('should overwrite existing user info', () => {
      const user1 = { uid: '1', email: 'user1@example.com', full_name: 'User One', avatar_url:  {
        public_url: 'http://example.com/avatar.jpg',
        origin_name: 'http://example.com/avatar.jpg',
        uid: 'avatar123',
      }};
      const user2 = { uid: '2', email: 'user2@example.com', full_name: 'User Two', avatar_url:  {
        public_url: 'http://example.com/avatar.jpg',
        origin_name: 'http://example.com/avatar.jpg',
        uid: 'avatar123',
      }};

      authStore.setUserInfo(user1);
      authStore.setUserInfo(user2);

      expect(localStorage.getItem('admin_user_info')).toBe(JSON.stringify(user2));
    });
  });

  describe('getUserInfo', () => {
    it('should return user info from localStorage', () => {
      const user = { uid: '123', email: 'test@example.com', full_name: 'Test User', avatar_url:  {
        public_url: 'http://example.com/avatar.jpg',
        origin_name: 'http://example.com/avatar.jpg',
        uid: 'avatar123',
      }};

      authStore.setUserInfo(user);

      const retrievedUser = authStore.getUserInfo();

      expect(retrievedUser).toEqual(user);
    });

    it('should return null when no user exists', () => {
      const user = authStore.getUserInfo();

      expect(user).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      authStore.setToken('token123');

      expect(authStore.isAuthenticated()).toBe(true);
    });

    it('should return false when no token exists', () => {
      expect(authStore.isAuthenticated()).toBe(false);
    });

    it('should return false after logout', () => {
      authStore.setToken('token123');
      authStore.logout();

      expect(authStore.isAuthenticated()).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear token from localStorage', () => {
      authStore.setToken('token123');
      authStore.logout();

      expect(localStorage.getItem('token')).toBeNull();
    });

    it('should clear user info from localStorage', () => {
      const user = { uid: '123', email: 'test@example.com', full_name: 'Test User', avatar_url:  {
        public_url: 'http://example.com/avatar.jpg',
        origin_name: 'http://example.com/avatar.jpg',
        uid: 'avatar123',
      }};
      authStore.setUserInfo(user);
      authStore.logout();

      expect(localStorage.getItem('user')).toBeNull();
    });

    it('should make isAuthenticated return false', () => {
      authStore.setToken('token123');
      authStore.logout();

      expect(authStore.isAuthenticated()).toBe(false);
    });
  });

  describe('auth state persistence', () => {
    it('should maintain auth state across multiple calls', () => {
      authStore.setToken('token123');
      const user = { uid: '123', email: 'test@example.com', full_name: 'Test User', avatar_url:  {
        public_url: 'http://example.com/avatar.jpg',
        origin_name: 'http://example.com/avatar.jpg',
        uid: 'avatar123',
      }};
      authStore.setUserInfo(user);

      expect(authStore.getToken()).toBe('token123');
      expect(authStore.getUserInfo()).toEqual(user);
      expect(authStore.isAuthenticated()).toBe(true);
    });

    it('should handle rapid logout/login cycles', () => {
      // Login
      authStore.setToken('token1');
      expect(authStore.isAuthenticated()).toBe(true);

      // Logout
      authStore.logout();
      expect(authStore.isAuthenticated()).toBe(false);

      // Login again
      authStore.setToken('token2');
      expect(authStore.isAuthenticated()).toBe(true);
    });
  });
});

import { authStore } from '../features/auth/auth.store'

export function useAuth() {
  const token = authStore.getToken()

  return {
    isAuthenticated: !!token,
  }
}

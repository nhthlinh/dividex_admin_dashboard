import { authStore } from '../features/auth/auth.store'

export function useAuth() {
  return { isAuthenticated: authStore.isAuthenticated() }
}

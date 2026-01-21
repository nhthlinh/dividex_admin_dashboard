const TOKEN_KEY = 'admin_token'

export const authStore = {
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY)
  },

  setToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token)
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY)
  },
}

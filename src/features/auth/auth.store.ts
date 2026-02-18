import type { User } from "../users/user.types"

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
    localStorage.removeItem('admin_user_info')
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY)
  },

  setUserInfo: (userInfo: User) => {
    localStorage.setItem('admin_user_info', JSON.stringify(userInfo))
  },

  getUserInfo: (): User | null => {
    const data = localStorage.getItem('admin_user_info')  
    return data ? JSON.parse(data) as User : null
  }
}

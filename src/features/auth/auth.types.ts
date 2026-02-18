import type { User } from "../users/user.types"

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string,
  refresh_token: string,
  user: User
}

export interface ApiError {
  message: string
  messageCode?: string
  status?: number
}

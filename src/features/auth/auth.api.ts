import { api } from "../../config/api.config"
import type { LoginRequest, LoginResponse } from "./auth.types"

export const AuthAPI = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>(
      '/auth/login',
      data
    )
    return res.data
  },
}

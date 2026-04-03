import { api } from "../../config/api.config"
import { mockApi, USE_MOCK } from "../../services/mockApi"
import type { ApiResponse } from "../../config/api.types"
import type { LoginRequest, LoginResponse } from "./auth.types"

export const AuthAPI = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    if (USE_MOCK) {
      return mockApi.login(data.email, data.password);
    }

    const res = await api.post<ApiResponse<LoginResponse>>(
      '/auth/login',
      data
    )
    return res.data.data
  },
}

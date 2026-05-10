/* eslint-disable @typescript-eslint/no-explicit-any */
// api.config.ts
import axios, { AxiosError } from 'axios'
import { authStore } from '../features/auth/auth.store'
import type { ApiError } from '../features/auth/auth.types'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Gắn token tự động
api.interceptors.request.use(config => {
  const token = authStore.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle lỗi chung
api.interceptors.response.use(
  res => res,
  (error: AxiosError) => {
    const errorMessage = (error.response?.data as any)?.message || ''
    const apiError: ApiError = {
      message: errorMessage || 'Có lỗi xảy ra, vui lòng thử lại',
      status: error.response?.status,
    }

    // Token không hợp lệ/hết hạn → logout & redirect to login
    const messageLower = errorMessage.toLowerCase()
    if (
      apiError.status === 401 ||
      apiError.status === 403 ||
      messageLower.includes('invalid') && messageLower.includes('token') ||
      messageLower.includes('token expired') ||
      messageLower.includes('unauthorized')
    ) {
      authStore.logout()
      // Redirect to login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(apiError)
  }
)
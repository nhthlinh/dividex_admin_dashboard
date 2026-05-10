import { useState, useCallback } from 'react'
import { api } from '../config/api.config'
import type { AxiosRequestConfig } from 'axios'

interface ApiCallState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useApiCall<T = any>() {
  const [state, setState] = useState<ApiCallState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const call = useCallback(
    async (url: string, config?: AxiosRequestConfig) => {
      setState({ data: null, loading: true, error: null })
      try {
        const response = await api.get<T>(url, config)
        setState({ data: response.data, loading: false, error: null })
        return response.data
      } catch (err: any) {
        const errorMessage = err.message || 'Có lỗi xảy ra'
        setState({ data: null, loading: false, error: errorMessage })
        
        // Token error sẽ được interceptor xử lý tự động
        throw err
      }
    },
    []
  )

  return { ...state, call }
}

import axios, { AxiosError } from 'axios'

export const TOKEN_KEY = 'aerotrek_token'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  },
  timeout: 15000,
})

// ── Request interceptor — attach JWT ────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor — handle 401 / 403 ─────────────────────
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    const status  = error.response?.status
    const message = error.response?.data?.message ?? error.response?.data?.error ?? ''

    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      window.location.href = '/login'
      return Promise.reject(error)
    }

    if (status === 403) {
      const isKycError =
        message.toLowerCase().includes('kyc') ||
        message.toLowerCase().includes('verification')
      if (isKycError) {
        window.location.href = '/dashboard/kyc'
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

export default api
import axios from 'axios'
import { API_BASE_URL } from '@/utils/constants'
import { supabase } from '@/lib/supabaseClient'

/**
 * Axios instance pre-configured with the API base URL.
 * An interceptor automatically injects the Supabase JWT into
 * every request as: Authorization: Bearer <token>
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — inject JWT from active Supabase session
apiClient.interceptors.request.use(
  async (config) => {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — normalize API errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred'

    return Promise.reject(new Error(message))
  }
)

export default apiClient

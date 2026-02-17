/**
 * @file src/core/api/interceptors/auth.ts
 * 
 * Interceptador de autenticação
 * 
 * Responsabilidades:
 * 1. Injeta Access Token nos headers
 * 2. Detecta expiração (401)
 * 3. Tenta refresh automático
 * 4. Retry da requisição original
 * 5. Logout automático se refresh falhar
 * 6. Evita múltiplas requisições de refresh simultâneas
 */

import { AxiosInstance, AxiosError } from 'axios'
import { API_ENDPOINTS } from '@core/config'

interface AuthInterceptorOptions {
  getAccessToken: () => string | null
  setAccessToken: (token: string) => void
  refreshAccessToken: () => Promise<void>
  onLogout: () => void
}

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: AxiosError) => void
}> = []

/**
 * Processa fila de requisições que aguardavam refresh
 */
function processQueue(error: AxiosError | null, token: string | null): void {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else if (token) {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

/**
 * Setup do interceptador de autenticação
 */
export function setupAuthInterceptor(
  axiosInstance: AxiosInstance,
  options: AuthInterceptorOptions
): void {
  const { getAccessToken, refreshAccessToken, onLogout } = options

  // Request interceptador - injeta access token
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = getAccessToken()

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      // Passa tenant ID via header se disponível
      const tenantId = localStorage.getItem('app.tenant.id')
      if (tenantId) {
        config.headers['X-Tenant-ID'] = tenantId
      }

      return config
    },
    (error) => Promise.reject(error)
  )

  // Response interceptador - trata refresh e retry
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const config = error.config

      // Se não é 401 ou não tem config, passa o erro adiante
      if (error.response?.status !== 401 || !config) {
        return Promise.reject(error)
      }

      // Evita refresh infinito em /auth/refresh
      if (config.url?.includes(API_ENDPOINTS.AUTH.REFRESH)) {
        onLogout()
        return Promise.reject(error)
      }

      // Se já está fazendo refresh, aguarda na fila
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          if (config.headers) {
            config.headers.Authorization = `Bearer ${token}`
          }
          return axiosInstance(config)
        })
      }

      // Marca como refreshing e tenta renovar token
      isRefreshing = true

      try {
        await refreshAccessToken()
        const newToken = getAccessToken()

        if (newToken && config.headers) {
          config.headers.Authorization = `Bearer ${newToken}`
          processQueue(null, newToken)
          return axiosInstance(config)
        } else {
          throw new Error('Token refresh retornou vazio')
        }
      } catch (refreshError) {
        processQueue(error, null)
        onLogout()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
  )
}

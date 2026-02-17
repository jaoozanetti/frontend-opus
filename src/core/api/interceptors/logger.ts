/**
 * @file src/core/api/interceptors/logger.ts
 * 
 * Interceptador de logging estruturado
 * 
 * Registra:
 * - Requisição (método, URL, headers importantes)
 * - Resposta (status, tempo)
 * - Erros com contexto
 */

import { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'
import { ApiRequestLog } from '@shared/types'
import { isDevelopment } from '@core/config'

const requestLogs: ApiRequestLog[] = []
const MAX_LOGS = 100 // Manter últimas 100 requisições

/**
 * Interface para armazenar timestamp de requisição
 */
declare global {
  namespace AxiosRequestConfig {
    interface AxiosRequestConfig {
      startTime?: number
    }
  }
}

/**
 * Setup do interceptador de logging
 */
export function setupLoggerInterceptor(axiosInstance: AxiosInstance): void {
  // Request interceptador
  axiosInstance.interceptors.request.use(
    (config) => {
      // Armazena tempo de início
      ;(config as AxiosRequestConfig & { startTime?: number }).startTime = Date.now()

      if (isDevelopment) {
        console.log(`📤 [${config.method?.toUpperCase()}] ${config.url}`)
      }

      return config
    },
    (error) => {
      console.error('❌ Erro ao preparar requisição:', error)
      return Promise.reject(error)
    }
  )

  // Response interceptador
  axiosInstance.interceptors.response.use(
    (response) => {
      const startTime = (response.config as AxiosRequestConfig & { startTime?: number }).startTime
      const duration = startTime ? Date.now() - startTime : 0

      const log: ApiRequestLog = {
        method: response.config.method || 'UNKNOWN',
        url: response.config.url || '',
        status: response.status,
        duration,
        timestamp: new Date().toISOString(),
      }

      requestLogs.push(log)
      if (requestLogs.length > MAX_LOGS) {
        requestLogs.shift()
      }

      if (isDevelopment) {
        console.log(`✅ [${response.status}] ${response.config.url} (${duration}ms)`)
      }

      return response
    },
    (error: AxiosError) => {
      const startTime = (error.config as AxiosRequestConfig & { startTime?: number })?.startTime
      const duration = startTime ? Date.now() - startTime : 0

      const log: ApiRequestLog = {
        method: error.config?.method || 'UNKNOWN',
        url: error.config?.url || '',
        status: error.response?.status,
        duration,
        timestamp: new Date().toISOString(),
        error: error.message,
      }

      requestLogs.push(log)
      if (requestLogs.length > MAX_LOGS) {
        requestLogs.shift()
      }

      console.error(`❌ [${error.response?.status}] ${error.config?.url}`, error.message)

      return Promise.reject(error)
    }
  )
}

/**
 * Obtém logs de requisições (para debugging)
 */
export function getRequestLogs(): ApiRequestLog[] {
  return [...requestLogs]
}

/**
 * Limpa logs
 */
export function clearRequestLogs(): void {
  requestLogs.length = 0
}

/**
 * @file src/shared/types/api.ts
 * 
 * Tipos e interfaces para API
 */

export interface IApiClient {
  get<T>(path: string, config?: unknown): Promise<T>
  post<T>(path: string, data?: unknown, config?: unknown): Promise<T>
  put<T>(path: string, data?: unknown, config?: unknown): Promise<T>
  patch<T>(path: string, data?: unknown, config?: unknown): Promise<T>
  delete<T>(path: string, config?: unknown): Promise<T>
}

export interface RequestConfig {
  headers?: Record<string, string>
  params?: Record<string, unknown>
  timeout?: number
  withCredentials?: boolean
}

export interface ApiRequestLog {
  method: string
  url: string
  status?: number
  duration: number
  timestamp: string
  error?: string
}

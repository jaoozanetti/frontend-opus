/**
 * @file src/shared/types/common.ts
 * 
 * Tipos comuns reutilizáveis em toda a aplicação
 */

/** Resposta genérica da API */
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  timestamp: string
}

/** Erro estruturado da API */
export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
  timestamp: string
}

/** Paginação */
export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

/** Resposta paginada */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta
}

/** Status de requisição assíncrona */
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'

/** Estado genérico assíncrono */
export interface AsyncState<T> {
  status: AsyncStatus
  data: T | null
  error: ApiError | null
  isLoading: boolean
}

/**
 * @file src/shared/hooks/useAsync.ts
 * 
 * Hook genérico para operações assíncronas com loading, data, error
 * 
 * Uso:
 *   const { data, isLoading, error, execute } = useAsync(fetchUsers)
 */

import { useState, useCallback } from 'react'
import { AsyncStatus, ApiError } from '@shared/types'

interface UseAsyncReturn<T> {
  data: T | null
  status: AsyncStatus
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  error: ApiError | null
  execute: (...args: unknown[]) => Promise<T | null>
  reset: () => void
}

export function useAsync<T>(
  asyncFunction: (...args: unknown[]) => Promise<T>
): UseAsyncReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [status, setStatus] = useState<AsyncStatus>('idle')
  const [error, setError] = useState<ApiError | null>(null)

  const execute = useCallback(async (...args: unknown[]): Promise<T | null> => {
    setStatus('loading')
    setError(null)

    try {
      const result = await asyncFunction(...args)
      setData(result)
      setStatus('success')
      return result
    } catch (err) {
      const apiError: ApiError = {
        code: 'ASYNC_ERROR',
        message: err instanceof Error ? err.message : 'Erro desconhecido',
        timestamp: new Date().toISOString(),
      }
      setError(apiError)
      setStatus('error')
      return null
    }
  }, [asyncFunction])

  const reset = useCallback(() => {
    setData(null)
    setStatus('idle')
    setError(null)
  }, [])

  return {
    data,
    status,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
    error,
    execute,
    reset,
  }
}

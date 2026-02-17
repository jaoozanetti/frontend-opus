/**
 * @file src/core/api/interceptors/error.ts
 * 
 * Interceptador de tratamento de erros
 * 
 * Responsabilidades:
 * - Normaliza respostas de erro
 * - Transforma erros do Axios em formato estruturado
 * - Trata casos especiais (timeout, network error, etc)
 */

import { AxiosInstance, AxiosError } from 'axios'
import { ApiError } from '@shared/types'

/**
 * Transforma erro do Axios em ApiError estruturado
 */
function normalizeError(error: AxiosError): ApiError {
  const responseData = error.response?.data as Record<string, unknown>

  // Se a API retorna erro estruturado
  if (error.response?.status && responseData?.code && responseData?.message) {
    return {
      code: String(responseData.code),
      message: String(responseData.message),
      details: (responseData.details as Record<string, unknown>) || undefined,
      timestamp: new Date().toISOString(),
    }
  }

  // Casos especiais de erro
  if (error.code === 'ECONNABORTED') {
    return {
      code: 'TIMEOUT',
      message: 'Requisição expirou. Tente novamente.',
      timestamp: new Date().toISOString(),
    }
  }

  if (error.message === 'Network Error') {
    return {
      code: 'NETWORK_ERROR',
      message: 'Erro de conexão. Verifique sua internet.',
      timestamp: new Date().toISOString(),
    }
  }

  // Erro genérico baseado em status
  const statusMessages: Record<number, string> = {
    400: 'Requisição inválida',
    401: 'Não autorizado',
    403: 'Acesso proibido',
    404: 'Recurso não encontrado',
    409: 'Conflito nos dados',
    422: 'Dados inválidos',
    429: 'Muitas requisições. Tente novamente mais tarde.',
    500: 'Erro interno do servidor',
    502: 'Serviço indisponível',
    503: 'Serviço indisponível',
  }

  const status = error.response?.status || 500
  return {
    code: `ERROR_${status}`,
    message: statusMessages[status] || 'Erro na requisição',
    timestamp: new Date().toISOString(),
  }
}

/**
 * Setup do interceptador de erro
 */
export function setupErrorInterceptor(axiosInstance: AxiosInstance): void {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const normalizedError = normalizeError(error)

      // Passa erro normalizado
      return Promise.reject(normalizedError)
    }
  )
}

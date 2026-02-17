/**
 * @file src/core/adapters/ApiClientFactory.ts
 * 
 * Factory para criar instância correta do ApiClient
 * 
 * Decisão de design:
 * - Baseado na variável VITE_USE_MOCK
 * - Retorna interface IApiClient (Dependency Inversion)
 * - UI nunca sabe qual implementação está usando
 * - Singleton para garantir mesma instância
 */

import { IApiClient } from '@shared/types'
import { isUsingMock, devLog } from '@core/config'
import { axiosInstance } from '@core/api'
import { RealApiClient } from './RealApiClient'
import { MockApiClient } from './MockApiClient'
import { registerAllMockHandlers } from '@core/mocks'

let apiClientInstance: IApiClient | null = null

/**
 * Cria cliente da API (real ou mock)
 * Singleton: retorna mesma instância sempre
 */
export function createApiClient(): IApiClient {
  if (apiClientInstance) {
    return apiClientInstance
  }

  if (isUsingMock) {
    devLog('🧪 Usando MockApiClient (VITE_USE_MOCK=true)')

    const mockClient = new MockApiClient()
    registerAllMockHandlers(mockClient)
    apiClientInstance = mockClient
  } else {
    devLog('🌐 Usando RealApiClient')
    apiClientInstance = new RealApiClient(axiosInstance)
  }

  return apiClientInstance
}

/**
 * Obtém instância do ApiClient (já criada)
 */
export function getApiClient(): IApiClient {
  if (!apiClientInstance) {
    return createApiClient()
  }
  return apiClientInstance
}

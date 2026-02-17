/**
 * @file src/core/adapters/MockApiClient.ts
 * 
 * Implementação mock do IApiClient
 * 
 * Decisão de design:
 * - Interceta chamadas e retorna dados de mock
 * - Simula latência de rede para UX realista
 * - Usa handlers para cada endpoint
 * - Mesma interface do RealApiClient (Liskov Substitution)
 */

import { IApiClient } from '@shared/types'

/** Handler para um endpoint específico */
export interface MockHandler<T = unknown> {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string | RegExp
  handler: (data?: unknown) => T | Promise<T>
}

/**
 * Simula latência de rede (100ms a 500ms)
 */
function simulateLatency(): Promise<void> {
  const delay = Math.floor(Math.random() * 400) + 100
  return new Promise((resolve) => setTimeout(resolve, delay))
}

/**
 * Busca handler baseado em method + path
 */
function findHandler(
  handlers: MockHandler[],
  method: string,
  path: string
): MockHandler | undefined {
  return handlers.find((h) => {
    const methodMatch = h.method === method.toUpperCase()
    const pathMatch = h.path instanceof RegExp
      ? h.path.test(path)
      : h.path === path
    return methodMatch && pathMatch
  })
}

export class MockApiClient implements IApiClient {
  private handlers: MockHandler[] = []

  /**
   * Registra handlers de mock
   */
  registerHandlers(handlers: MockHandler[]): void {
    this.handlers.push(...handlers)
  }

  async get<T>(path: string): Promise<T> {
    await simulateLatency()
    const handler = findHandler(this.handlers, 'GET', path)

    if (!handler) {
      console.warn(`[MOCK] Handler não encontrado: GET ${path}`)
      throw new Error(`Mock handler não encontrado para GET ${path}`)
    }

    console.log(`[MOCK] GET ${path}`)
    return handler.handler() as T
  }

  async post<T>(path: string, data?: unknown): Promise<T> {
    await simulateLatency()
    const handler = findHandler(this.handlers, 'POST', path)

    if (!handler) {
      console.warn(`[MOCK] Handler não encontrado: POST ${path}`)
      throw new Error(`Mock handler não encontrado para POST ${path}`)
    }

    console.log(`[MOCK] POST ${path}`, data)
    return handler.handler(data) as T
  }

  async put<T>(path: string, data?: unknown): Promise<T> {
    await simulateLatency()
    const handler = findHandler(this.handlers, 'PUT', path)

    if (!handler) {
      console.warn(`[MOCK] Handler não encontrado: PUT ${path}`)
      throw new Error(`Mock handler não encontrado para PUT ${path}`)
    }

    console.log(`[MOCK] PUT ${path}`, data)
    return handler.handler(data) as T
  }

  async patch<T>(path: string, data?: unknown): Promise<T> {
    await simulateLatency()
    const handler = findHandler(this.handlers, 'PATCH', path)

    if (!handler) {
      console.warn(`[MOCK] Handler não encontrado: PATCH ${path}`)
      throw new Error(`Mock handler não encontrado para PATCH ${path}`)
    }

    console.log(`[MOCK] PATCH ${path}`, data)
    return handler.handler(data) as T
  }

  async delete<T>(path: string): Promise<T> {
    await simulateLatency()
    const handler = findHandler(this.handlers, 'DELETE', path)

    if (!handler) {
      console.warn(`[MOCK] Handler não encontrado: DELETE ${path}`)
      throw new Error(`Mock handler não encontrado para DELETE ${path}`)
    }

    console.log(`[MOCK] DELETE ${path}`)
    return handler.handler() as T
  }
}

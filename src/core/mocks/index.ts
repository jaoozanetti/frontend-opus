/**
 * @file src/core/mocks/index.ts
 * 
 * Registry central de mock handlers
 * 
 * Decisão de design:
 * - Ponto único de registro de todos os handlers
 * - Facilita adicionar novos endpoints mock no futuro
 * - Basta criar um novo handler file e importar aqui
 * 
 * Para adicionar novos endpoints mock:
 * 1. Crie um arquivo em src/core/mocks/handlers/[nome]Handlers.ts
 * 2. Exporte um array de MockHandler[]
 * 3. Importe e registre neste arquivo
 */

import { MockApiClient } from '@core/adapters/MockApiClient'
import { authHandlers, tenantHandlers, userHandlers, auditHandlers } from './handlers'

/**
 * Registra todos os handlers mock no MockApiClient
 */
export function registerAllMockHandlers(client: MockApiClient): void {
  client.registerHandlers(authHandlers)
  client.registerHandlers(tenantHandlers)
  client.registerHandlers(userHandlers)
  client.registerHandlers(auditHandlers)
}

export * from './data'
export * from './handlers'

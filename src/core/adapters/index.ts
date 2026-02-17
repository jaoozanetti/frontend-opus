/**
 * @file src/core/adapters/index.ts
 */

export { RealApiClient } from './RealApiClient'
export { MockApiClient } from './MockApiClient'
export type { MockHandler } from './MockApiClient'
export { createApiClient, getApiClient } from './ApiClientFactory'

/**
 * @file src/core/config/env.ts
 * 
 * Gerenciamento de variáveis de ambiente com validação
 * 
 * Decisão de design:
 * - Centraliza todas as env vars em um único lugar
 * - Valida existência e tipos em runtime
 * - Evita magic strings espalhadas pelo código
 * - TypeScript garante que todas as vars necessárias existem
 */

interface EnvironmentConfig {
  API_BASE_URL: string
  USE_MOCK: boolean
  NODE_ENV: 'development' | 'production' | 'test'
}

/**
 * Valida e carrega configuração de ambiente
 * Lança erro se alguma var obrigatória estiver faltando
 */
function loadEnvironmentConfig(): EnvironmentConfig {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  const useMock = import.meta.env.VITE_USE_MOCK
  const nodeEnv = import.meta.env.MODE as 'development' | 'production' | 'test'

  if (!apiBaseUrl) {
    throw new Error('❌ VITE_API_BASE_URL não configurada')
  }

  // VITE_USE_MOCK é opcional, default false
  // if (useMock === undefined) {
  //   throw new Error('❌ VITE_USE_MOCK não configurada (deve ser true ou false)')
  // }

  return {
    API_BASE_URL: apiBaseUrl,
    USE_MOCK: useMock === 'true' || false,
    NODE_ENV: nodeEnv,
  }
}

/**
 * Config carregada e validada automaticamente
 * Erro em tempo de inicialização se houver problema
 */
export const env = loadEnvironmentConfig()

/**
 * Validações de environment
 */
export const isProduction = env.NODE_ENV === 'production'
export const isDevelopment = env.NODE_ENV === 'development'
export const isUsingMock = env.USE_MOCK

/**
 * Função auxiliar para logging condicional (apenas em dev)
 */
export function devLog(message: string, data?: unknown): void {
  if (isDevelopment) {
    console.log(`[DEV] ${message}`, data)
  }
}

/**
 * Função auxiliar para erro condicional
 */
export function devError(message: string, error?: unknown): void {
  if (isDevelopment) {
    console.error(`[DEV ERROR] ${message}`, error)
  }
}

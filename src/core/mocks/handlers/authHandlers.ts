/**
 * @file src/core/mocks/handlers/authHandlers.ts
 * 
 * Handlers mock para endpoints de autenticação
 * 
 * Decisão de design:
 * - Simula login/logout/refresh
 * - Gera token JWT fictício
 * - Valida credenciais contra dados mock
 */

import { MockHandler } from '@core/adapters'
import { LoginRequest, LoginResponse, RefreshTokenResponse } from '@shared/types'
import { findUserByEmail } from '@core/mocks/data'

/**
 * Gera access token fictício (NÃO é JWT válido, apenas para mock)
 */
function generateMockAccessToken(userId: string): string {
  const payload = btoa(JSON.stringify({ userId, exp: Date.now() + 3600000 }))
  return `mock.${payload}.token`
}

export const authHandlers: MockHandler[] = [
  {
    method: 'POST',
    path: '/auth/login',
    handler: (data?: unknown) => {
      const { email } = data as LoginRequest
      const user = findUserByEmail(email)

      if (!user) {
        throw { code: 'AUTH_INVALID', message: 'Credenciais inválidas', timestamp: new Date().toISOString() }
      }

      const response: LoginResponse = {
        user,
        accessToken: generateMockAccessToken(user.id),
        refreshToken: 'mock-refresh-token-' + user.id,
      }

      return {
        success: true,
        data: response,
        timestamp: new Date().toISOString(),
      }
    },
  },
  {
    method: 'POST',
    path: '/auth/refresh',
    handler: () => {
      const response: RefreshTokenResponse = {
        accessToken: generateMockAccessToken('user-001'),
      }

      return {
        success: true,
        data: response,
        timestamp: new Date().toISOString(),
      }
    },
  },
  {
    method: 'POST',
    path: '/auth/logout',
    handler: () => ({
      success: true,
      data: null,
      message: 'Logout realizado com sucesso',
      timestamp: new Date().toISOString(),
    }),
  },
  {
    method: 'GET',
    path: '/auth/me',
    handler: () => {
      // Retorna primeiro usuário mock como "logado"
      const user = findUserByEmail('admin@acme.com')

      return {
        success: true,
        data: { user },
        timestamp: new Date().toISOString(),
      }
    },
  },
]

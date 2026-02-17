/**
 * @file src/core/api/tokenStore.ts
 * 
 * Armazenamento de tokens JWT em escopo de módulo
 * 
 * - access_token: mantido em memória (segurança)
 * - refresh_token: mantido em localStorage (persistência entre reloads)
 */

const REFRESH_TOKEN_KEY = 'app.refresh_token'

let accessToken: string | null = null

export function getAccessToken(): string | null {
  return accessToken
}

export function setAccessToken(token: string | null): void {
  accessToken = token
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setRefreshToken(token: string | null): void {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  }
}

export function clearTokens(): void {
  accessToken = null
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

/**
 * Decodifica o payload de um JWT (sem verificar assinatura)
 */
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = parts[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

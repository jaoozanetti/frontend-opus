/**
 * @file src/main.tsx
 * 
 * Entry point da aplicação Vite + React
 * 
 * Ordem de inicialização:
 * 1. Carrega estilos globais (Tailwind + CSS variables)
 * 2. Configura interceptors do Axios (auth, logger, error)
 * 3. Renderiza App (TenantContext → AuthContext → ThemeContext)
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import '@shared/styles/globals.css'

import { axiosInstance } from '@core/api'
import { setupLoggerInterceptor } from '@core/api/interceptors/logger'
import { setupErrorInterceptor } from '@core/api/interceptors/error'
import { setupAuthInterceptor } from '@core/api/interceptors/auth'
import {
  getAccessToken,
  setAccessToken as storeSetAccessToken,
  getRefreshToken,
  setRefreshToken as storeSetRefreshToken,
  clearTokens,
} from '@core/api/tokenStore'

import App from './App'

// ──────────────────────────────
// 1. Configura interceptors globais no axios
// ──────────────────────────────
setupLoggerInterceptor(axiosInstance)

// Auth interceptor: injeta Bearer token e trata refresh em 401
setupAuthInterceptor(axiosInstance, {
  getAccessToken: () => getAccessToken(),
  setAccessToken: (token: string) => storeSetAccessToken(token),
  refreshAccessToken: async () => {
    const refreshTk = getRefreshToken()
    if (!refreshTk) {
      throw new Error('Sem refresh token')
    }
    const response = await axiosInstance.post('/auth/refresh', { refresh_token: refreshTk })
    const { access_token, refresh_token } = response.data
    storeSetAccessToken(access_token)
    storeSetRefreshToken(refresh_token)
  },
  onLogout: () => {
    clearTokens()
    window.location.href = '/login'
  },
})

setupErrorInterceptor(axiosInstance)

// ──────────────────────────────
// 2. Renderiza aplicação
// ──────────────────────────────
const root = document.getElementById('root')

if (!root) {
  throw new Error('Root element não encontrado. Verifique index.html.')
}

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

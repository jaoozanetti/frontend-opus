/**
 * @file src/main.tsx
 * 
 * Entry point da aplicação Vite + React
 * 
 * Ordem de inicialização:
 * 1. Carrega estilos globais (Tailwind + CSS variables)
 * 2. Inicializa API client (real ou mock)
 * 3. Configura interceptors (logger, error)
 * 4. Renderiza App (que inicia TenantContext → AuthContext → ThemeContext)
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import '@shared/styles/globals.css'

import { axiosInstance } from '@core/api'
import { setupLoggerInterceptor } from '@core/api/interceptors/logger'
import { setupErrorInterceptor } from '@core/api/interceptors/error'
import { createApiClient } from '@core/adapters'

import App from './App'

// ──────────────────────────────
// 1. Configura interceptors globais no axios
// ──────────────────────────────
setupLoggerInterceptor(axiosInstance)
setupErrorInterceptor(axiosInstance)

// ──────────────────────────────
// 2. Inicializa API client (Factory: real ou mock)
// ──────────────────────────────
createApiClient()

// ──────────────────────────────
// 3. Renderiza aplicação
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

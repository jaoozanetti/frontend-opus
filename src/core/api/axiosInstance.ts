/**
 * @file src/core/api/axiosInstance.ts
 * 
 * Instância de Axios configurada
 * 
 * Decisão de design:
 * - Criada UMA ÚNICA vez na inicialização
 * - Interceptadores adicionados após contextos de auth/tenant carregarem
 * - Base URL + headers padrão centralizados
 */

import axios, { AxiosInstance } from 'axios'
import { env } from '@core/config'

/**
 * Cria instância do axios com configuração padrão
 */
export function createAxiosInstance(): AxiosInstance {
  const instance = axios.create({
    baseURL: env.API_BASE_URL,
    timeout: 10000,
    withCredentials: true, // Para enviar cookies httpOnly automaticamente
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return instance
}

/**
 * Instância exportada (será injetada com interceptadores depois)
 */
export const axiosInstance = createAxiosInstance()

/**
 * @file src/core/adapters/RealApiClient.ts
 * 
 * Implementação "real" do IApiClient
 * Usa axios para fazer requisições HTTP reais à API
 * 
 * Decisão de design:
 * - Implementa mesma interface que MockApiClient
 * - Retorna apenas response.data (desembala AxiosResponse)
 * - Pode ser substituído por MockApiClient sem impacto
 */

import { AxiosInstance, AxiosRequestConfig } from 'axios'
import { IApiClient } from '@shared/types'

export class RealApiClient implements IApiClient {
  private axiosInstance: AxiosInstance

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance
  }

  async get<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(path, config)
    return response.data
  }

  async post<T>(path: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(path, data, config)
    return response.data
  }

  async put<T>(path: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(path, data, config)
    return response.data
  }

  async patch<T>(path: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.patch<T>(path, data, config)
    return response.data
  }

  async delete<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(path, config)
    return response.data
  }
}

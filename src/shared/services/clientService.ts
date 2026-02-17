/**
 * @file src/shared/services/clientService.ts
 * 
 * Serviço para operações CRUD de clientes
 */

import { axiosInstance, endpoints, getAccessToken } from '@core/api'
import { Client, CreateClientRequest, UpdateClientRequest } from '@shared/types'

function authHeaders() {
  const token = getAccessToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function listClients(): Promise<Client[]> {
  const response = await axiosInstance.get(endpoints.clients.list(), {
    headers: authHeaders(),
  })
  return response.data
}

export async function getClient(id: number): Promise<Client> {
  const response = await axiosInstance.get(endpoints.clients.detail(String(id)), {
    headers: authHeaders(),
  })
  return response.data
}

export async function createClient(data: CreateClientRequest): Promise<Client> {
  const response = await axiosInstance.post(endpoints.clients.create(), data, {
    headers: authHeaders(),
  })
  return response.data
}

export async function updateClient(id: number, data: UpdateClientRequest): Promise<void> {
  await axiosInstance.patch(endpoints.clients.update(String(id)), data, {
    headers: authHeaders(),
  })
}

export async function deleteClient(id: number): Promise<void> {
  await axiosInstance.delete(endpoints.clients.delete(String(id)), {
    headers: authHeaders(),
  })
}

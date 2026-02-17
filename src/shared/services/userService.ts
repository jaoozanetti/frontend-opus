/**
 * @file src/shared/services/userService.ts
 * 
 * Serviço para operações CRUD de usuários
 */

import { axiosInstance, endpoints, getAccessToken } from '@core/api'

export interface ApiUser {
  id: number
  email: string
  name: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

function authHeaders() {
  const token = getAccessToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function listUsers(): Promise<ApiUser[]> {
  const response = await axiosInstance.get(endpoints.users.list(), {
    headers: authHeaders(),
  })
  return response.data
}

export async function getUser(id: number): Promise<ApiUser> {
  const response = await axiosInstance.get(endpoints.users.detail(String(id)), {
    headers: authHeaders(),
  })
  return response.data
}

export async function createUser(data: { name: string; email: string; password: string }): Promise<ApiUser> {
  const response = await axiosInstance.post(endpoints.users.create(), data)
  return response.data
}

export async function updateUser(id: number, data: { name?: string; email?: string; password?: string }): Promise<ApiUser> {
  const response = await axiosInstance.patch(endpoints.users.update(String(id)), data, {
    headers: authHeaders(),
  })
  return response.data
}

export async function deleteUser(id: number): Promise<void> {
  await axiosInstance.delete(endpoints.users.delete(String(id)), {
    headers: authHeaders(),
  })
}

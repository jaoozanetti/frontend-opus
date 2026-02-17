/**
 * @file src/shared/types/client.ts
 * 
 * Tipos para a entidade Cliente (API de Vendas)
 */

export interface Client {
  id: number
  name: string
  email: string
  phone: string | null
  cpf: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface CreateClientRequest {
  name: string
  email: string
  cpf: string
}

export interface UpdateClientRequest {
  name?: string
  email?: string
  cpf?: string
}

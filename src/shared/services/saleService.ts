/**
 * @file src/shared/services/saleService.ts
 * 
 * Serviço para operações CRUD de vendas
 */

import { axiosInstance, endpoints, getAccessToken } from '@core/api'
import { SaleResponse, CreateSaleRequest, PaginatedSaleResponse } from '@shared/types'

function authHeaders() {
  const token = getAccessToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function listSales(page = 1, limit = 10): Promise<PaginatedSaleResponse> {
  const response = await axiosInstance.get(endpoints.sales.list(), {
    headers: authHeaders(),
    params: { page, limit },
  })
  return response.data
}

export async function getSale(id: number): Promise<SaleResponse> {
  const response = await axiosInstance.get(endpoints.sales.detail(String(id)), {
    headers: authHeaders(),
  })
  return response.data
}

export async function createSale(data: CreateSaleRequest): Promise<SaleResponse> {
  const response = await axiosInstance.post(endpoints.sales.create(), data, {
    headers: authHeaders(),
  })
  return response.data
}

export async function deleteSale(id: number): Promise<{ message: string }> {
  const response = await axiosInstance.delete(endpoints.sales.delete(String(id)), {
    headers: authHeaders(),
  })
  return response.data
}

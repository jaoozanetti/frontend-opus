/**
 * @file src/shared/services/productService.ts
 * 
 * Serviço para operações CRUD de produtos
 */

import { axiosInstance, endpoints, getAccessToken } from '@core/api'
import { Product, CreateProductRequest, UpdateProductRequest, PaginatedProductResponse } from '@shared/types'

function authHeaders() {
  const token = getAccessToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function listProducts(page = 1, limit = 10): Promise<PaginatedProductResponse> {
  const response = await axiosInstance.get(endpoints.products.list(), {
    headers: authHeaders(),
    params: { page, limit },
  })
  return response.data
}

export async function getProduct(id: number): Promise<Product> {
  const response = await axiosInstance.get(endpoints.products.detail(String(id)), {
    headers: authHeaders(),
  })
  return response.data
}

export async function createProduct(data: CreateProductRequest): Promise<Product> {
  const response = await axiosInstance.post(endpoints.products.create(), data, {
    headers: authHeaders(),
  })
  return response.data
}

export async function updateProduct(id: number, data: UpdateProductRequest): Promise<Product> {
  const response = await axiosInstance.patch(endpoints.products.update(String(id)), data, {
    headers: authHeaders(),
  })
  return response.data
}

export async function deleteProduct(id: number): Promise<void> {
  await axiosInstance.delete(endpoints.products.delete(String(id)), {
    headers: authHeaders(),
  })
}

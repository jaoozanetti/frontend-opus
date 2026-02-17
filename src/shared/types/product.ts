/**
 * @file src/shared/types/product.ts
 * 
 * Tipos para a entidade Produto (API de Vendas)
 */

export interface Product {
  id: number
  name: string
  description: string | null
  price: number
  stock: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface CreateProductRequest {
  name: string
  description?: string
  price: number
  stock: number
}

export interface UpdateProductRequest {
  name?: string
  description?: string
  price?: number
  stock?: number
}

export interface PaginatedProductResponse {
  data: Product[]
  meta: {
    totalItems: number
    itemCount: number
    itemsPerPage: number
    totalPages: number
    currentPage: number
  }
}

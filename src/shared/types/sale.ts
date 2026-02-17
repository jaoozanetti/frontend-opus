/**
 * @file src/shared/types/sale.ts
 * 
 * Tipos para a entidade Venda (API de Vendas)
 */

export interface SaleItemResponse {
  productId: number
  productName: string
  amount: number
  unitPrice: number
  subtotal: number
}

export interface SaleResponse {
  id: number
  date: string
  total: number
  clientName: string
  items: SaleItemResponse[]
}

export interface CreateSaleItemRequest {
  productId: number
  amount: number
}

export interface CreateSaleRequest {
  clientId: number
  items: CreateSaleItemRequest[]
}

export interface PaginatedSaleResponse {
  data: SaleResponse[]
  meta: {
    totalItems: number
    itemCount: number
    itemsPerPage: number
    totalPages: number
    currentPage: number
  }
}

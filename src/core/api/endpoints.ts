/**
 * @file src/core/api/endpoints.ts
 * 
 * Funções auxiliares para construir URLs de endpoints
 */

import { API_ENDPOINTS } from '@core/config'

type ParamMap = Record<string, string>

/**
 * Substitui path params em URLs template
 * 
 * @example
 * buildUrl('/users/:userId', { userId: '123' })
 * // Result: '/users/123'
 */
export function buildUrl(template: string, params?: ParamMap): string {
  if (!params) return template

  let url = template
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, encodeURIComponent(value))
  })

  return url
}

/**
 * Endpoints prontos para uso (tipados)
 */
export const endpoints = {
  auth: {
    login: () => API_ENDPOINTS.AUTH.LOGIN,
    logout: () => API_ENDPOINTS.AUTH.LOGOUT,
    refresh: () => API_ENDPOINTS.AUTH.REFRESH,
    me: () => API_ENDPOINTS.AUTH.ME,
  },
  tenant: {
    config: (tenantId: string) => buildUrl(API_ENDPOINTS.TENANTS.CONFIG, { tenantId }),
  },
  users: {
    list: () => API_ENDPOINTS.USERS.LIST,
    detail: (userId: string) => buildUrl(API_ENDPOINTS.USERS.DETAIL, { userId }),
    create: () => API_ENDPOINTS.USERS.CREATE,
    update: (userId: string) => buildUrl(API_ENDPOINTS.USERS.UPDATE, { userId }),
    delete: (userId: string) => buildUrl(API_ENDPOINTS.USERS.DELETE, { userId }),
  },
  clients: {
    list: () => API_ENDPOINTS.CLIENTS.LIST,
    detail: (clientId: string) => buildUrl(API_ENDPOINTS.CLIENTS.DETAIL, { clientId }),
    create: () => API_ENDPOINTS.CLIENTS.CREATE,
    update: (clientId: string) => buildUrl(API_ENDPOINTS.CLIENTS.UPDATE, { clientId }),
    delete: (clientId: string) => buildUrl(API_ENDPOINTS.CLIENTS.DELETE, { clientId }),
  },
  products: {
    list: () => API_ENDPOINTS.PRODUCTS.LIST,
    detail: (productId: string) => buildUrl(API_ENDPOINTS.PRODUCTS.DETAIL, { productId }),
    create: () => API_ENDPOINTS.PRODUCTS.CREATE,
    update: (productId: string) => buildUrl(API_ENDPOINTS.PRODUCTS.UPDATE, { productId }),
    delete: (productId: string) => buildUrl(API_ENDPOINTS.PRODUCTS.DELETE, { productId }),
  },
  sales: {
    list: () => API_ENDPOINTS.SALES.LIST,
    detail: (saleId: string) => buildUrl(API_ENDPOINTS.SALES.DETAIL, { saleId }),
    create: () => API_ENDPOINTS.SALES.CREATE,
    update: (saleId: string) => buildUrl(API_ENDPOINTS.SALES.UPDATE, { saleId }),
    delete: (saleId: string) => buildUrl(API_ENDPOINTS.SALES.DELETE, { saleId }),
  },
  audit: {
    list: () => API_ENDPOINTS.AUDIT.LIST,
    create: () => API_ENDPOINTS.AUDIT.CREATE,
  },
  profiles: {
    list: () => API_ENDPOINTS.PROFILES.LIST,
    detail: (profileId: string) => buildUrl(API_ENDPOINTS.PROFILES.DETAIL, { profileId }),
  },
  permissions: {
    list: () => API_ENDPOINTS.PERMISSIONS.LIST,
  },
} as const

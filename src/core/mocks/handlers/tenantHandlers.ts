/**
 * @file src/core/mocks/handlers/tenantHandlers.ts
 * 
 * Handlers mock para endpoints de tenant
 */

import { MockHandler } from '@core/adapters'
import { findTenantBySlug, findTenantById, mockTenants } from '@core/mocks/data'

export const tenantHandlers: MockHandler[] = [
  {
    method: 'GET',
    path: /^\/tenants\/[^/]+\/config$/,
    handler: (data?: unknown) => {
      // Extrai tenantId do path (feito pelo handler dispatch)
      // Como o mock intercepta, precisamos lidar com path matching
      // Retorna o primeiro tenant como fallback
      const tenantId = (data as { tenantId?: string })?.tenantId
      const tenant = tenantId
        ? findTenantById(tenantId) || findTenantBySlug(tenantId)
        : mockTenants[0]

      if (!tenant) {
        throw {
          code: 'TENANT_NOT_FOUND',
          message: 'Tenant não encontrado',
          timestamp: new Date().toISOString(),
        }
      }

      return {
        success: true,
        data: { tenant },
        timestamp: new Date().toISOString(),
      }
    },
  },
]

/**
 * @file src/core/contexts/TenantContext.tsx
 * 
 * Contexto global de tenant
 * 
 * Como a api-vendas não possui multi-tenancy,
 * fornecemos um tenant padrão hardcoded.
 */

import { createContext, useCallback, useMemo, useState, ReactNode } from 'react'
import { Tenant, TenantContextType } from '@shared/types'

const TenantContext = createContext<TenantContextType | undefined>(undefined)

/** Tenant padrão para API de Vendas */
const defaultTenant: Tenant = {
  id: 'default',
  name: 'API de Vendas',
  slug: 'vendas',
  brand: {
    name: 'Gestão de Vendas',
    logoUrl: '',
    faviconUrl: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    darkModeEnabled: true,
    description: 'Sistema de gestão de vendas, clientes e produtos',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

interface TenantProviderProps {
  children: ReactNode
}

export function TenantProvider({ children }: TenantProviderProps) {
  const [tenant] = useState<Tenant>(defaultTenant)
  const [tenantId] = useState<string>('default')
  const isLoading = false
  const error = null

  const loadTenant = useCallback(async (_id: string) => {
    // No-op: API não possui multi-tenancy
  }, [])

  const resolveTenant = useCallback(async () => {
    // No-op: tenant é sempre o padrão
  }, [])

  const contextValue = useMemo<TenantContextType>(() => ({
    tenant,
    tenantId,
    isLoading,
    error,
    loadTenant,
    resolveTenant,
  }), [tenant, tenantId, loadTenant, resolveTenant])

  return (
    <TenantContext.Provider value={contextValue}>
      {children}
    </TenantContext.Provider>
  )
}

export { TenantContext }

/**
 * @file src/core/contexts/TenantContext.tsx
 * 
 * Contexto global de tenant (multi-tenancy)
 * 
 * Decisão de design:
 * - Tenant resolvido ANTES do login
 * - Detecção automática por subdomínio
 * - Fallback para VITE_DEFAULT_TENANT ou 'acme'
 * - Carrega branding do tenant para white-label
 * - Header X-Tenant-ID injetado em todas as requisições
 */

import { createContext, useCallback, useEffect, useMemo, useState, ReactNode } from 'react'
import { Tenant, TenantContextType } from '@shared/types'
import { getApiClient } from '@core/adapters'
import { endpoints } from '@core/api'
import { STORAGE_KEYS, devLog, devError } from '@core/config'

const TenantContext = createContext<TenantContextType | undefined>(undefined)

/**
 * Extrai slug do tenant a partir do subdomínio
 * 
 * Exemplos:
 * - acme.saas.com → 'acme'
 * - beta.saas.com → 'beta'
 * - localhost → fallback para 'acme' (desenvolvimento)
 */
function extractTenantSlugFromSubdomain(): string | null {
  const hostname = window.location.hostname
  const parts = hostname.split('.')

  // Em produção: subdomain.domain.com → parts[0] é o tenant
  if (parts.length >= 3) {
    const slug = parts[0]
    if (slug !== 'www' && slug !== 'api') {
      return slug
    }
  }

  // Em desenvolvimento: verifica se há tenant salvo
  const savedTenantId = localStorage.getItem(STORAGE_KEYS.TENANT_ID)
  if (savedTenantId) {
    return savedTenantId
  }

  // Fallback padrão (development)
  return 'acme'
}

interface TenantProviderProps {
  children: ReactNode
}

export function TenantProvider({ children }: TenantProviderProps) {
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [tenantId, setTenantId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Carrega configuração do tenant via API
   */
  const loadTenant = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const apiClient = getApiClient()
      const url = endpoints.tenant.config(id)
      const response = await apiClient.get<{ success: boolean; data: { tenant: Tenant } }>(url)

      const loadedTenant = response.data.tenant
      setTenant(loadedTenant)
      setTenantId(loadedTenant.id)

      // Persiste tenant para próximas sessões (apenas o ID, não dados sensíveis)
      localStorage.setItem(STORAGE_KEYS.TENANT_ID, loadedTenant.slug)

      devLog('Tenant carregado:', loadedTenant.name)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar tenant'
      setError(errorMessage)
      devError('Falha ao carregar tenant', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Resolve tenant automaticamente (subdomínio ou header)
   */
  const resolveTenant = useCallback(async () => {
    const slug = extractTenantSlugFromSubdomain()
    if (slug) {
      await loadTenant(slug)
    } else {
      setError('Não foi possível identificar o tenant')
      setIsLoading(false)
    }
  }, [loadTenant])

  // Resolve tenant automaticamente na montagem
  useEffect(() => {
    resolveTenant()
  }, [resolveTenant])

  const contextValue = useMemo<TenantContextType>(() => ({
    tenant,
    tenantId,
    isLoading,
    error,
    loadTenant,
    resolveTenant,
  }), [tenant, tenantId, isLoading, error, loadTenant, resolveTenant])

  return (
    <TenantContext.Provider value={contextValue}>
      {children}
    </TenantContext.Provider>
  )
}

export { TenantContext }

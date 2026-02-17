/**
 * @file src/shared/types/tenant.ts
 * 
 * Tipos de tenant e multi-tenancy
 * 
 * Design:
 * - Tenant identificado por subdomínio ou header customizado
 * - Carregado ANTES do login para aplicar branding
 * - Inclui configuração branding (white-label)
 */

export interface BrandConfig {
  name: string
  logoUrl: string
  faviconUrl: string
  primaryColor: string            // #hex (ex: #3B82F6)
  secondaryColor: string          // #hex (ex: #10B981)
  darkModeEnabled: boolean
  description?: string
}

export interface Tenant {
  id: string
  name: string
  slug: string                    // subdomínio ou identificador
  brand: BrandConfig
  createdAt: string
  updatedAt: string
}

export interface TenantContextType {
  tenant: Tenant | null
  tenantId: string | null
  isLoading: boolean
  error: string | null

  // Actions
  loadTenant: (tenantId: string) => Promise<void>
  resolveTenant: () => Promise<void>
}

export interface TenantConfigRequest {
  tenantId: string
}

export interface TenantConfigResponse {
  tenant: Tenant
}

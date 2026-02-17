/**
 * @file src/shared/hooks/useTenant.ts
 * 
 * Hook para acessar contexto de tenant
 * Garante que é usado dentro do TenantProvider
 */

import { useContext } from 'react'
import { TenantContext } from '@core/contexts'
import { TenantContextType } from '@shared/types'

export function useTenant(): TenantContextType {
  const context = useContext(TenantContext)

  if (!context) {
    throw new Error('useTenant deve ser usado dentro de <TenantProvider>')
  }

  return context
}

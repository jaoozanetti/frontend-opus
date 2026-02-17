/**
 * @file src/shared/hooks/usePermission.ts
 * 
 * Hook para verificar permissões do usuário (RBAC dinâmico)
 * 
 * Uso:
 *   const canCreateUser = usePermission('users.create')
 *   const canManageUsers = usePermissions(['users.create', 'users.update'], 'any')
 */

import { useMemo } from 'react'
import { useAuth } from './useAuth'

/**
 * Verifica uma permissão única
 */
export function usePermission(permissionCode: string): boolean {
  const { hasPermission } = useAuth()
  return useMemo(() => hasPermission(permissionCode), [hasPermission, permissionCode])
}

/**
 * Verifica múltiplas permissões com estratégia
 * - 'any': precisa de pelo menos uma
 * - 'all': precisa de todas
 */
export function usePermissions(
  permissionCodes: string[],
  strategy: 'any' | 'all' = 'any'
): boolean {
  const { hasAnyPermission, hasAllPermissions } = useAuth()

  return useMemo(() => {
    if (strategy === 'any') {
      return hasAnyPermission(permissionCodes)
    }
    return hasAllPermissions(permissionCodes)
  }, [hasAnyPermission, hasAllPermissions, permissionCodes, strategy])
}

/**
 * @file src/routes/ProtectedRoute.tsx
 * 
 * Guard de rota protegida com RBAC
 * 
 * Decisão de design:
 * - Verifica autenticação antes de renderizar
 * - Verifica permissão específica se definida
 * - Redireciona para login se não autenticado
 * - Mostra 403 se autenticado mas sem permissão
 */

import { Navigate } from 'react-router-dom'
import { useAuth } from '@shared/hooks'

interface ProtectedRouteProps {
  children: React.ReactNode
  /** Permissão necessária (ex: 'users.create') */
  requiredPermission?: string
  /** Redireciona para esta rota se não autenticado */
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  requiredPermission,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasPermission } = useAuth()

  // Aguarda validação de autenticação
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
      </div>
    )
  }

  // Redireciona para login se não autenticado
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  // Verifica permissão se especificada
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center animate-fade-in">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
            <span className="text-2xl">🔒</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>
              Acesso negado
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
              Você não tem permissão para acessar esta página.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

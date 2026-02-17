/**
 * @file src/shared/hooks/useAuth.ts
 * 
 * Hook para acessar contexto de autenticação
 * Garante que é usado dentro do AuthProvider
 */

import { useContext } from 'react'
import { AuthContext } from '@core/contexts'
import { AuthContextType } from '@shared/types'

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  }

  return context
}

/**
 * @file src/shared/hooks/useTheme.ts
 * 
 * Hook para acessar contexto de tema
 * Garante que é usado dentro do ThemeProvider
 */

import { useContext } from 'react'
import { ThemeContext } from '@core/contexts'
import { ThemeContextType } from '@shared/types'

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme deve ser usado dentro de <ThemeProvider>')
  }

  return context
}

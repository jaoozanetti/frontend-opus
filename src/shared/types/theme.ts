/**
 * @file src/shared/types/theme.ts
 * 
 * Tipos de tema e white-label dinâmico
 * 
 * Design:
 * - Temas carregados dinamicamente da configuração do tenant
 * - Suporte a Dark/Light mode
 * - Aplicado via CSS variables
 */

export type ThemeMode = 'light' | 'dark'

export interface ThemeColors {
  primary: string                 // #hex
  secondary: string               // #hex
  background: string              // #hex
  foreground: string              // #hex
  muted: string                   // #hex
  mutedForeground: string         // #hex
  destructive: string             // #hex
  border: string                  // #hex
}

export interface Theme {
  mode: ThemeMode
  colors: ThemeColors
}

export interface ThemeContextType {
  theme: Theme
  isDarkMode: boolean
  toggleDarkMode: () => void
  applyBrandTheme: (brand: BrandConfigLight) => void
}

export interface BrandConfigLight {
  primaryColor: string
  secondaryColor: string
  darkModeEnabled: boolean
}

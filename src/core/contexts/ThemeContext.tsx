/**
 * @file src/core/contexts/ThemeContext.tsx
 * 
 * Contexto global de tema (White-label + Dark/Light mode)
 * 
 * Decisão de design:
 * - Cores dinâmicas via CSS custom properties
 * - Dark mode preferência salva em localStorage
 * - Branding carregado do TenantContext
 * - Tema aplicado via classe 'dark' no HTML root (Tailwind)
 * - CSS variables permitem mudar cores sem re-render
 */

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react'
import { ThemeContextType, Theme, ThemeMode, ThemeColors, BrandConfigLight } from '@shared/types'
import { STORAGE_KEYS } from '@core/config'

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

/**
 * Cores padrão para light/dark mode
 */
const defaultLightColors: ThemeColors = {
  primary: '#3B82F6',
  secondary: '#10B981',
  background: '#FFFFFF',
  foreground: '#0F172A',
  muted: '#F1F5F9',
  mutedForeground: '#64748B',
  destructive: '#EF4444',
  border: '#E2E8F0',
}

const defaultDarkColors: ThemeColors = {
  primary: '#60A5FA',
  secondary: '#34D399',
  background: '#0F172A',
  foreground: '#F8FAFC',
  muted: '#1E293B',
  mutedForeground: '#94A3B8',
  destructive: '#F87171',
  border: '#334155',
}

/**
 * Aplica CSS custom properties no root element
 */
function applyThemeVariables(colors: ThemeColors): void {
  const root = document.documentElement

  root.style.setProperty('--color-primary', colors.primary)
  root.style.setProperty('--color-secondary', colors.secondary)
  root.style.setProperty('--color-background', colors.background)
  root.style.setProperty('--color-foreground', colors.foreground)
  root.style.setProperty('--color-muted', colors.muted)
  root.style.setProperty('--color-muted-foreground', colors.mutedForeground)
  root.style.setProperty('--color-destructive', colors.destructive)
  root.style.setProperty('--color-border', colors.border)
}

/**
 * Atualiza favicon dinamicamente
 */
export function updateFavicon(faviconUrl: string): void {
  const link: HTMLLinkElement =
    document.querySelector("link[rel~='icon']") || document.createElement('link')
  link.rel = 'icon'
  link.href = faviconUrl
  document.head.appendChild(link)
}

/**
 * Atualiza título da página
 */
export function updatePageTitle(title: string): void {
  document.title = title
}

/**
 * Lê preferência de dark mode do localStorage
 */
function getStoredDarkModePreference(): boolean {
  const stored = localStorage.getItem(STORAGE_KEYS.THEME_PREFERENCE)
  if (stored !== null) {
    return JSON.parse(stored) as boolean
  }

  // Detecta preferência do sistema
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(getStoredDarkModePreference)
  const [brandColors, setBrandColors] = useState<{ primary: string; secondary: string } | null>(null)

  /**
   * Calcula cores atuais baseado em mode + branding
   */
  const currentColors = useMemo<ThemeColors>(() => {
    const baseColors = isDarkMode ? defaultDarkColors : defaultLightColors

    if (brandColors) {
      return {
        ...baseColors,
        primary: brandColors.primary,
        secondary: brandColors.secondary,
      }
    }

    return baseColors
  }, [isDarkMode, brandColors])

  /**
   * Theme object completo
   */
  const theme = useMemo<Theme>(() => ({
    mode: (isDarkMode ? 'dark' : 'light') as ThemeMode,
    colors: currentColors,
  }), [isDarkMode, currentColors])

  /**
   * Toggle dark mode e persiste no localStorage
   */
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      const newValue = !prev
      localStorage.setItem(STORAGE_KEYS.THEME_PREFERENCE, JSON.stringify(newValue))
      return newValue
    })
  }, [])

  /**
   * Aplica cores do branding do tenant
   */
  const applyBrandTheme = useCallback((brand: BrandConfigLight) => {
    setBrandColors({
      primary: brand.primaryColor,
      secondary: brand.secondaryColor,
    })
  }, [])

  // Aplica CSS variables quando tema muda
  useEffect(() => {
    applyThemeVariables(currentColors)

    // Toggle classe 'dark' no HTML root (TailwindCSS)
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [currentColors, isDarkMode])

  const contextValue = useMemo<ThemeContextType>(() => ({
    theme,
    isDarkMode,
    toggleDarkMode,
    applyBrandTheme,
  }), [theme, isDarkMode, toggleDarkMode, applyBrandTheme])

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export { ThemeContext }

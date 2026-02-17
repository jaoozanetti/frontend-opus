/**
 * @file src/App.tsx
 * 
 * Root component da aplicação
 * 
 * Responsabilidades:
 * 1. TenantProvider: resolve tenant ANTES de qualquer coisa
 * 2. ThemeProvider: aplica branding dinâmico
 * 3. AuthProvider: gerencia autenticação
 * 4. AppRoutes: renderiza rotas baseadas em auth/role
 * 
 * Ordem dos providers é CRÍTICA:
 * Tenant → Theme → Auth → Routes
 * (Tenant precisa estar antes de tudo para branding funcionar)
 */

import { useEffect } from 'react'
import { TenantProvider } from '@core/contexts/TenantContext'
import { ThemeProvider, updateFavicon, updatePageTitle } from '@core/contexts/ThemeContext'
import { AuthProvider } from '@core/contexts/AuthContext'
import { useTenant } from '@shared/hooks/useTenant'
import { useTheme } from '@shared/hooks/useTheme'
import { AppRoutes } from '@/routes/Routes'

/**
 * Componente interno que aplica branding do tenant
 * Precisa estar DENTRO do TenantProvider e ThemeProvider
 */
function BrandApplicator({ children }: { children: React.ReactNode }) {
  const { tenant } = useTenant()
  const { applyBrandTheme } = useTheme()

  useEffect(() => {
    if (tenant?.brand) {
      applyBrandTheme({
        primaryColor: tenant.brand.primaryColor,
        secondaryColor: tenant.brand.secondaryColor,
        darkModeEnabled: tenant.brand.darkModeEnabled,
      })
      updatePageTitle(tenant.brand.name)
      updateFavicon(tenant.brand.faviconUrl)
    }
  }, [tenant, applyBrandTheme])

  return <>{children}</>
}

/**
 * Componente interno que conecta Auth ao Tenant
 */
function AuthenticatedApp() {
  const { tenantId, isLoading: isTenantLoading, error: tenantError } = useTenant()

  // Enquanto o tenant está sendo resolvido
  if (isTenantLoading) {
    return <LoadingScreen message="Carregando plataforma..." />
  }

  // Se o tenant não foi encontrado
  if (tenantError) {
    return <ErrorScreen message={tenantError} />
  }

  return (
    <AuthProvider tenantId={tenantId}>
      <BrandApplicator>
        <AppRoutes />
      </BrandApplicator>
    </AuthProvider>
  )
}

/**
 * Tela de loading (usada durante resolução do tenant)
 */
function LoadingScreen({ message }: { message: string }) {
  return (
    <div className="flex h-screen w-full items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
        <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>{message}</p>
      </div>
    </div>
  )
}

/**
 * Tela de erro (tenant não encontrado)
 */
function ErrorScreen({ message }: { message: string }) {
  return (
    <div className="flex h-screen w-full items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="flex flex-col items-center gap-4 text-center animate-fade-in">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <span className="text-2xl">⚠</span>
        </div>
        <div>
          <h1 className="text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>
            Plataforma não encontrada
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * App Root Component
 */
export default function App() {
  return (
    <TenantProvider>
      <ThemeProvider>
        <AuthenticatedApp />
      </ThemeProvider>
    </TenantProvider>
  )
}

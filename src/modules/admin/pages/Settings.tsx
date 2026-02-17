/**
 * @file src/modules/admin/pages/Settings.tsx
 * 
 * Página de configurações do Admin
 */

import { PageContainer } from '@shared/components/Layout/PageContainer'
import { Card, CardHeader } from '@shared/components/UI/Card'
import { useAuth, useTenant, useTheme } from '@shared/hooks'
import { Button } from '@shared/components/UI/Button'

export function AdminSettings() {
  const { user } = useAuth()
  const { tenant } = useTenant()
  const { isDarkMode, toggleDarkMode, theme } = useTheme()

  return (
    <PageContainer
      title="Configurações"
      description="Configurações da plataforma"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Tema"
            description="Preferência de exibição"
          />
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: 'var(--color-foreground)' }}>
              Modo {isDarkMode ? 'Escuro' : 'Claro'}
            </span>
            <Button variant="outline" size="sm" onClick={toggleDarkMode}>
              {isDarkMode ? '☀️ Mudar para Claro' : '🌙 Mudar para Escuro'}
            </Button>
          </div>
          <div className="mt-4 flex gap-2">
            <div className="h-8 w-8 rounded-full" style={{ backgroundColor: theme.colors.primary }} title="Primary" />
            <div className="h-8 w-8 rounded-full" style={{ backgroundColor: theme.colors.secondary }} title="Secondary" />
            <div className="h-8 w-8 rounded-full border" style={{ backgroundColor: theme.colors.background, borderColor: 'var(--color-border)' }} title="Background" />
            <div className="h-8 w-8 rounded-full" style={{ backgroundColor: theme.colors.muted }} title="Muted" />
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Informações da Conta"
            description="Dados do usuário atual"
          />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: 'var(--color-muted-foreground)' }}>Nome:</span>
              <span style={{ color: 'var(--color-foreground)' }}>{user?.name}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--color-muted-foreground)' }}>Email:</span>
              <span style={{ color: 'var(--color-foreground)' }}>{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--color-muted-foreground)' }}>Perfil:</span>
              <span style={{ color: 'var(--color-foreground)' }}>{user?.profile.name}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--color-muted-foreground)' }}>Tenant:</span>
              <span style={{ color: 'var(--color-foreground)' }}>{tenant?.name}</span>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  )
}

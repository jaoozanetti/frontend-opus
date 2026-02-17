/**
 * @file src/modules/admin/pages/Dashboard.tsx
 * 
 * Dashboard do Admin
 */

import { PageContainer } from '@shared/components/Layout/PageContainer'
import { Card, CardHeader } from '@shared/components/UI/Card'
import { useAuth } from '@shared/hooks'
import { useTenant } from '@shared/hooks'

export function AdminDashboard() {
  const { user } = useAuth()
  const { tenant } = useTenant()

  return (
    <PageContainer
      title="Dashboard"
      description={`Bem-vindo, ${user?.name || 'Administrador'}`}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader title="Usuários" description="Total de usuários ativos" />
          <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
            24
          </p>
        </Card>
        <Card>
          <CardHeader title="Tenant" description="Tenant atual" />
          <p className="text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>
            {tenant?.name || '-'}
          </p>
        </Card>
        <Card>
          <CardHeader title="Perfil" description="Seu perfil de acesso" />
          <p className="text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>
            {user?.profile.name || '-'}
          </p>
        </Card>
        <Card>
          <CardHeader title="Permissões" description="Total de permissões" />
          <p className="text-3xl font-bold" style={{ color: 'var(--color-secondary)' }}>
            {user?.profile.permissions.length || 0}
          </p>
        </Card>
      </div>
    </PageContainer>
  )
}

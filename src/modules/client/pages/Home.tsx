/**
 * @file src/modules/client/pages/Home.tsx
 */

import { PageContainer } from '@shared/components/Layout/PageContainer'
import { Card, CardHeader } from '@shared/components/UI/Card'
import { useAuth } from '@shared/hooks'
import { useTenant } from '@shared/hooks'

export function ClientHome() {
  const { user } = useAuth()
  const { tenant } = useTenant()

  return (
    <PageContainer
      title={`Olá, ${user?.name || 'Usuário'} 👋`}
      description={tenant?.brand.description || 'Bem-vindo à plataforma'}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader title="Início rápido" description="Comece por aqui" />
          <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
            Esta é a área do cliente. Aqui você terá acesso aos módulos da plataforma.
          </p>
        </Card>
        <Card>
          <CardHeader title="Conta" description="Informações da sua conta" />
          <div className="space-y-1 text-sm">
            <p style={{ color: 'var(--color-muted-foreground)' }}>
              Email: <span style={{ color: 'var(--color-foreground)' }}>{user?.email}</span>
            </p>
            <p style={{ color: 'var(--color-muted-foreground)' }}>
              Perfil: <span style={{ color: 'var(--color-foreground)' }}>{user?.profile.name}</span>
            </p>
          </div>
        </Card>
      </div>
    </PageContainer>
  )
}

/**
 * @file src/modules/client/pages/Dashboard.tsx
 */

import { PageContainer } from '@shared/components/Layout/PageContainer'
import { Card, CardHeader } from '@shared/components/UI/Card'

export function ClientDashboard() {
  return (
    <PageContainer title="Dashboard" description="Visão geral dos seus dados">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader title="Atividades" description="Últimas atividades" />
          <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>12</p>
        </Card>
        <Card>
          <CardHeader title="Notificações" description="Pendentes" />
          <p className="text-2xl font-bold" style={{ color: 'var(--color-secondary)' }}>3</p>
        </Card>
        <Card>
          <CardHeader title="Tarefas" description="Em andamento" />
          <p className="text-2xl font-bold" style={{ color: 'var(--color-foreground)' }}>7</p>
        </Card>
      </div>
    </PageContainer>
  )
}

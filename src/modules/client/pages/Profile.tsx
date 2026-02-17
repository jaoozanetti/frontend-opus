/**
 * @file src/modules/client/pages/Profile.tsx
 */

import { useState } from 'react'
import { PageContainer } from '@shared/components/Layout/PageContainer'
import { Card, CardHeader } from '@shared/components/UI/Card'
import { Input } from '@shared/components/UI/Input'
import { Button } from '@shared/components/UI/Button'
import { Badge } from '@shared/components/UI/Badge'
import { useAuth } from '@shared/hooks/useAuth'

export function ClientProfile() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.name ?? '')
  const [email] = useState(user?.email ?? '')

  const handleSave = () => {
    // TODO: integrar com API real
    setIsEditing(false)
  }

  return (
    <PageContainer title="Meu Perfil" description="Gerencie suas informações pessoais">
      <div className="max-w-2xl space-y-6">
        {/* Informações do usuário */}
        <Card>
          <CardHeader title="Dados Pessoais" description="Suas informações de conta" />

          <div className="space-y-4">
            <Input
              label="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
            />
            <Input
              label="E-mail"
              value={email}
              disabled
            />

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
                Perfil:
              </span>
              <Badge variant="primary">{user?.profile?.name ?? 'N/A'}</Badge>
            </div>

            <div className="flex gap-3 pt-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave}>Salvar</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Editar Perfil
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Permissões */}
        <Card>
          <CardHeader title="Permissões" description="Suas permissões no sistema" />
          <div className="flex flex-wrap gap-2">
            {user?.profile?.permissions.map((perm) => (
              <Badge key={perm.id} variant="secondary">
                {perm.module}.{perm.action}
              </Badge>
            )) ?? (
              <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                Nenhuma permissão atribuída
              </p>
            )}
          </div>
        </Card>
      </div>
    </PageContainer>
  )
}

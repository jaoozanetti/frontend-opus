/**
 * @file src/modules/admin/pages/Users.tsx
 * 
 * Página de gerenciamento de usuários
 * Integra AuditModal para ações críticas
 */

import { useEffect, useState, useCallback } from 'react'
import { PageContainer } from '@shared/components/Layout/PageContainer'
import { Card } from '@shared/components/UI/Card'
import { Button } from '@shared/components/UI/Button'
import { Badge } from '@shared/components/UI/Badge'
import { AuditModal } from '@shared/components/Modals/AuditModal'
import { useAuditAction } from '@shared/components/Modals/useAuditAction'
import { AuditAction, AuthUser, ApiResponse, PaginatedResponse } from '@shared/types'
import { getApiClient } from '@core/adapters'
import { endpoints } from '@core/api'
import { formatDateTime } from '@shared/utils'

export function UsersPage() {
  const [users, setUsers] = useState<AuthUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { openAudit, auditModalProps } = useAuditAction()

  const loadUsers = useCallback(async () => {
    setIsLoading(true)
    try {
      const apiClient = getApiClient()
      const response = await apiClient.get<PaginatedResponse<AuthUser>>(endpoints.users.list())
      setUsers(response.data)
    } catch (err) {
      console.error('Erro ao carregar usuários:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const handleDeleteUser = (user: AuthUser) => {
    openAudit({
      action: AuditAction.DELETE,
      entity: 'users',
      entityId: user.id,
      previousData: { name: user.name, email: user.email },
      newData: {},
      onExecute: async () => {
        const apiClient = getApiClient()
        await apiClient.delete<ApiResponse<null>>(endpoints.users.delete(user.id))
      },
      onSuccess: () => {
        loadUsers()
      },
    })
  }

  return (
    <PageContainer
      title="Usuários"
      description="Gerencie os usuários da plataforma"
      action={
        <Button variant="primary" size="sm">
          + Novo Usuário
        </Button>
      }
    >
      <Card padding="sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[var(--color-primary)]" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="border-b text-left"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <th className="px-4 py-3 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Nome</th>
                  <th className="px-4 py-3 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Email</th>
                  <th className="px-4 py-3 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Perfil</th>
                  <th className="px-4 py-3 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Último Login</th>
                  <th className="px-4 py-3 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b transition-colors hover:opacity-80"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <td className="px-4 py-3" style={{ color: 'var(--color-foreground)' }}>
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: 'var(--color-primary)' }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        {user.name}
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--color-muted-foreground)' }}>
                      {user.email}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="info">{user.profile.name}</Badge>
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--color-muted-foreground)' }}>
                      {formatDateTime(user.lastLoginAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">Editar</Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user)}
                          className="text-red-500 hover:text-red-600"
                        >
                          Remover
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal de auditoria (desacoplada) */}
      <AuditModal {...auditModalProps} />
    </PageContainer>
  )
}

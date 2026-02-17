/**
 * @file src/modules/admin/pages/Audit.tsx
 * 
 * Página de logs de auditoria
 */

import { useEffect, useState, useCallback } from 'react'
import { PageContainer } from '@shared/components/Layout/PageContainer'
import { Card } from '@shared/components/UI/Card'
import { Badge } from '@shared/components/UI/Badge'
import { AuditLog, AuditAction } from '@shared/types'
import { listAuditLogs } from '@shared/services'
import { formatDateTime, formatAuditAction } from '@shared/utils'

const actionBadgeVariant: Record<AuditAction, 'success' | 'info' | 'error' | 'warning'> = {
  [AuditAction.CREATE]: 'success',
  [AuditAction.UPDATE]: 'info',
  [AuditAction.DELETE]: 'error',
  [AuditAction.INACTIVE]: 'warning',
}

export function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadLogs = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await listAuditLogs()
      setLogs(data)
    } catch (err) {
      console.error('Erro ao carregar logs de auditoria:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadLogs()
  }, [loadLogs])

  return (
    <PageContainer
      title="Auditoria"
      description="Registro de todas as ações críticas realizadas na plataforma"
    >
      <Card padding="sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[var(--color-primary)]" />
          </div>
        ) : logs.length === 0 ? (
          <div className="py-12 text-center">
            <p style={{ color: 'var(--color-muted-foreground)' }}>Nenhum log de auditoria encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left" style={{ borderColor: 'var(--color-border)' }}>
                  <th className="px-4 py-3 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Data/Hora</th>
                  <th className="px-4 py-3 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Ação</th>
                  <th className="px-4 py-3 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Entidade</th>
                  <th className="px-4 py-3 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Usuário</th>
                  <th className="px-4 py-3 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Justificativa</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: 'var(--color-muted-foreground)' }}>
                      {formatDateTime(log.timestamp)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={actionBadgeVariant[log.action]}>
                        {formatAuditAction(log.action)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--color-foreground)' }}>
                      {log.entity}
                      <span className="ml-1 font-mono text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                        ({log.entityId})
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--color-muted-foreground)' }}>
                      {log.userEmail}
                    </td>
                    <td className="max-w-xs truncate px-4 py-3" style={{ color: 'var(--color-muted-foreground)' }}>
                      {log.justification}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </PageContainer>
  )
}

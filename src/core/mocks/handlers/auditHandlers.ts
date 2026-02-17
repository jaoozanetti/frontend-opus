/**
 * @file src/core/mocks/handlers/auditHandlers.ts
 * 
 * Handlers mock para endpoints de auditoria
 */

import { MockHandler } from '@core/adapters'
import { AuditLog, AuditAction } from '@shared/types'

const mockAuditLogs: AuditLog[] = [
  {
    id: 'audit-001',
    action: AuditAction.CREATE,
    entity: 'users',
    entityId: 'user-002',
    previousData: null,
    newData: { email: 'user@acme.com', name: 'Usuário Acme' },
    justification: 'Novo usuário solicitado pelo gestor',
    timestamp: '2024-08-01T12:00:00Z',
    tenantId: 'tenant-001',
    userId: 'user-001',
    userEmail: 'admin@acme.com',
    createdAt: '2024-08-01T12:00:00Z',
  },
  {
    id: 'audit-002',
    action: AuditAction.UPDATE,
    entity: 'users',
    entityId: 'user-002',
    previousData: { name: 'Usuário' },
    newData: { name: 'Usuário Acme' },
    justification: 'Correção de nome do usuário',
    timestamp: '2024-08-02T09:30:00Z',
    tenantId: 'tenant-001',
    userId: 'user-001',
    userEmail: 'admin@acme.com',
    createdAt: '2024-08-02T09:30:00Z',
  },
]

export const auditHandlers: MockHandler[] = [
  {
    method: 'GET',
    path: '/audit-logs',
    handler: () => ({
      success: true,
      data: mockAuditLogs,
      meta: {
        page: 1,
        limit: 20,
        total: mockAuditLogs.length,
        totalPages: 1,
      },
      timestamp: new Date().toISOString(),
    }),
  },
  {
    method: 'POST',
    path: '/audit-logs',
    handler: (data?: unknown) => {
      const newLog: AuditLog = {
        id: 'audit-' + Date.now(),
        ...(data as Omit<AuditLog, 'id' | 'createdAt'>),
        createdAt: new Date().toISOString(),
      }

      mockAuditLogs.push(newLog)

      return {
        success: true,
        data: newLog,
        message: 'Log de auditoria registrado',
        timestamp: new Date().toISOString(),
      }
    },
  },
]

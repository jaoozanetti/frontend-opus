/**
 * @file src/shared/types/audit.ts
 * 
 * Tipos de auditoria e logging
 * 
 * Design:
 * - Auditoria apenas para CRUD críticas (CREATE, UPDATE, DELETE, INACTIVE)
 * - Modal obrigatória que bloqueia a ação até justificativa
 * - Payload estruturado para logging
 */

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  INACTIVE = 'INACTIVE',
}

export interface AuditPayload {
  id?: string
  action: AuditAction
  entity: string                  // 'user', 'tenant', 'client'
  entityId: string
  previousData: Record<string, unknown> | null
  newData: Record<string, unknown>
  justification: string           // Preenchido pelo usuário
  timestamp: string
  tenantId: string
  userId: string
  userEmail: string
}

export interface AuditLog {
  id: string
  action: AuditAction
  entity: string
  entityId: string
  previousData: Record<string, unknown> | null
  newData: Record<string, unknown>
  justification: string
  timestamp: string
  tenantId: string
  userId: string
  userEmail: string
  createdAt: string
}

export interface AuditModalState {
  isOpen: boolean
  action: AuditAction
  entity: string
  entityId: string
  previousData: Record<string, unknown> | null
  newData: Record<string, unknown>
  isSubmitting: boolean
}

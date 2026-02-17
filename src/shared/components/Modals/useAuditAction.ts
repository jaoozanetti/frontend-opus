/**
 * @file src/shared/components/Modals/useAuditAction.ts
 * 
 * Hook que conecta AuditModal com AuditService
 * 
 * Uso:
 *   const { openAudit, AuditModalComponent } = useAuditAction()
 *   
 *   openAudit({
 *     action: AuditAction.DELETE,
 *     entity: 'users',
 *     entityId: 'user-001',
 *     previousData: { name: 'Old' },
 *     newData: {},
 *     onExecute: () => apiClient.delete('/users/user-001')
 *   })
 */

import { useState, useCallback } from 'react'
import { AuditAction, AuditPayload } from '@shared/types'
import { executeWithAudit, createAuditPayload } from '@shared/services'
import { useAuth } from '@shared/hooks/useAuth'
import { useTenant } from '@shared/hooks/useTenant'

interface AuditActionParams {
  action: AuditAction
  entity: string
  entityId: string
  previousData: Record<string, unknown> | null
  newData: Record<string, unknown>
  onExecute: () => Promise<unknown>
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

interface AuditActionState {
  isOpen: boolean
  action: AuditAction
  entity: string
  entityId: string
  previousData: Record<string, unknown> | null
  newData: Record<string, unknown>
  onExecute: (() => Promise<unknown>) | null
  onSuccess: (() => void) | null
  onError: ((error: unknown) => void) | null
}

const initialState: AuditActionState = {
  isOpen: false,
  action: AuditAction.CREATE,
  entity: '',
  entityId: '',
  previousData: null,
  newData: {},
  onExecute: null,
  onSuccess: null,
  onError: null,
}

export function useAuditAction() {
  const [state, setState] = useState<AuditActionState>(initialState)
  const { user } = useAuth()
  const { tenantId } = useTenant()

  /**
   * Abre modal de auditoria
   */
  const openAudit = useCallback((params: AuditActionParams) => {
    setState({
      isOpen: true,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId,
      previousData: params.previousData,
      newData: params.newData,
      onExecute: params.onExecute,
      onSuccess: params.onSuccess || null,
      onError: params.onError || null,
    })
  }, [])

  /**
   * Confirma com justificativa (chamado pelo AuditModal)
   */
  const handleConfirm = useCallback(async (justification: string) => {
    if (!state.onExecute || !user || !tenantId) return

    const auditPayload: AuditPayload = createAuditPayload({
      action: state.action,
      entity: state.entity,
      entityId: state.entityId,
      previousData: state.previousData,
      newData: state.newData,
      justification,
      tenantId,
      userId: user.id,
      userEmail: user.email,
    })

    try {
      await executeWithAudit(auditPayload, state.onExecute)
      state.onSuccess?.()
    } catch (err) {
      state.onError?.(err)
      throw err
    } finally {
      setState(initialState)
    }
  }, [state, user, tenantId])

  /**
   * Cancela ação
   */
  const handleCancel = useCallback(() => {
    setState(initialState)
  }, [])

  return {
    openAudit,
    auditModalProps: {
      isOpen: state.isOpen,
      action: state.action,
      entity: state.entity,
      entityId: state.entityId,
      onConfirm: handleConfirm,
      onCancel: handleCancel,
    },
  }
}

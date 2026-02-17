/**
 * @file src/shared/services/auditService.ts
 * 
 * Serviço de auditoria desacoplado da UI
 * 
 * Decisão de design:
 * - Função executeWithAudit: wrapper que exige justificativa ANTES de executar
 * - Registra audit log na API APÓS sucesso da operação
 * - Desacoplado: componentes não precisam saber dos detalhes de auditoria
 * - Usado em conjunto com AuditModal (UI pede justificativa)
 */

import { AuditPayload, AuditAction, AuditLog, ApiResponse } from '@shared/types'
import { getApiClient } from '@core/adapters'
import { endpoints } from '@core/api'
import { devLog, devError } from '@core/config'

/**
 * Registra log de auditoria na API
 */
async function logAuditEntry(payload: AuditPayload): Promise<AuditLog> {
  const apiClient = getApiClient()
  const response = await apiClient.post<ApiResponse<AuditLog>>(
    endpoints.audit.create(),
    payload
  )
  devLog('Auditoria registrada: ' + payload.action + ' ' + payload.entity)
  return response.data
}

/**
 * Cria payload de auditoria estruturado
 */
export function createAuditPayload(params: {
  action: AuditAction
  entity: string
  entityId: string
  previousData: Record<string, unknown> | null
  newData: Record<string, unknown>
  justification: string
  tenantId: string
  userId: string
  userEmail: string
}): AuditPayload {
  return {
    ...params,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Executa uma operação com auditoria obrigatória
 * 
 * Fluxo:
 * 1. Recebe justificativa (já fornecida pelo AuditModal)
 * 2. Executa a operação (apiCall)
 * 3. Se sucesso, registra log de auditoria
 * 4. Retorna resultado da operação
 * 
 * @param auditData - Dados para o log de auditoria
 * @param apiCall - A função que realmente executa a operação
 * @returns Resultado da operação
 */
export async function executeWithAudit<T>(
  auditData: AuditPayload,
  apiCall: () => Promise<T>
): Promise<T> {
  try {
    // 1. Executa operação principal
    const result = await apiCall()

    // 2. Registra auditoria (após sucesso)
    try {
      await logAuditEntry(auditData)
    } catch (auditError) {
      // Auditoria falhou mas operação principal já executou
      // Loga erro mas NÃO reverte a operação
      devError('Falha ao registrar auditoria (operação já executada)', auditError)
    }

    return result
  } catch (operationError) {
    // Operação falhou, NÃO registra auditoria
    devError('Operação falhou, auditoria não registrada', operationError)
    throw operationError
  }
}

/**
 * Lista logs de auditoria
 */
export async function listAuditLogs(): Promise<AuditLog[]> {
  const apiClient = getApiClient()
  const response = await apiClient.get<ApiResponse<AuditLog[]>>(
    endpoints.audit.list()
  )
  return response.data
}

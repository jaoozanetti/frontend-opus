/**
 * @file src/shared/components/Modals/AuditModal.tsx
 * 
 * Modal obrigatória de auditoria
 * 
 * Decisão de design:
 * - Abre ANTES de qualquer ação CRUD crítica
 * - Obriga preenchimento de justificativa
 * - Persistent: não pode ser fechada sem ação
 * - Desacoplada: recebe callbacks, não sabe sobre entidades
 */

import { useState, FormEvent } from 'react'
import { Modal } from '@shared/components/UI/Modal'
import { Button } from '@shared/components/UI/Button'
import { AuditAction } from '@shared/types'
import { formatAuditAction } from '@shared/utils'

interface AuditModalProps {
  isOpen: boolean
  action: AuditAction
  entity: string
  entityId: string
  onConfirm: (justification: string) => Promise<void>
  onCancel: () => void
}

const MIN_JUSTIFICATION_LENGTH = 10

export function AuditModal({
  isOpen,
  action,
  entity,
  entityId,
  onConfirm,
  onCancel,
}: AuditModalProps) {
  const [justification, setJustification] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isValid = justification.trim().length >= MIN_JUSTIFICATION_LENGTH

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!isValid) {
      setError(`Justificativa deve ter no mínimo ${MIN_JUSTIFICATION_LENGTH} caracteres.`)
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await onConfirm(justification.trim())
      setJustification('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao executar operação')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setJustification('')
    setError(null)
    onCancel()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={`Confirmar ${formatAuditAction(action)}`}
      persistent
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Info da ação */}
        <div
          className="rounded-lg p-3"
          style={{ backgroundColor: 'var(--color-muted)' }}
        >
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex justify-between">
              <span style={{ color: 'var(--color-muted-foreground)' }}>Ação:</span>
              <span className="font-medium" style={{ color: 'var(--color-foreground)' }}>
                {formatAuditAction(action)}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--color-muted-foreground)' }}>Entidade:</span>
              <span className="font-medium" style={{ color: 'var(--color-foreground)' }}>
                {entity}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--color-muted-foreground)' }}>ID:</span>
              <span className="font-mono text-xs" style={{ color: 'var(--color-foreground)' }}>
                {entityId}
              </span>
            </div>
          </div>
        </div>

        {/* Justificativa obrigatória */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="audit-justification"
            className="text-sm font-medium"
            style={{ color: 'var(--color-foreground)' }}
          >
            Justificativa <span className="text-red-500">*</span>
          </label>
          <textarea
            id="audit-justification"
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            placeholder="Descreva o motivo desta ação..."
            rows={3}
            className="w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 resize-none"
            style={{
              backgroundColor: 'var(--color-background)',
              color: 'var(--color-foreground)',
              borderColor: error ? 'var(--color-destructive)' : 'var(--color-border)',
            }}
            autoFocus
          />
          <div className="flex justify-between">
            <p className="text-xs" style={{ color: error ? 'var(--color-destructive)' : 'var(--color-muted-foreground)' }}>
              {error || `Mínimo ${MIN_JUSTIFICATION_LENGTH} caracteres`}
            </p>
            <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
              {justification.length}
            </p>
          </div>
        </div>

        {/* Ações */}
        <div
          className="flex justify-end gap-3 border-t pt-4"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant={action === AuditAction.DELETE || action === AuditAction.INACTIVE ? 'destructive' : 'primary'}
            isLoading={isSubmitting}
            disabled={!isValid}
          >
            Confirmar {formatAuditAction(action)}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

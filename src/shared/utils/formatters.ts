/**
 * @file src/shared/utils/formatters.ts
 * 
 * Funções de formatação reutilizáveis
 */

/**
 * Formata data ISO para exibição local
 */
export function formatDate(isoDate: string, locale: string = 'pt-BR'): string {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(isoDate))
}

/**
 * Formata data + hora
 */
export function formatDateTime(isoDate: string, locale: string = 'pt-BR'): string {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoDate))
}

/**
 * Formata moeda BRL
 */
export function formatCurrency(value: number, locale: string = 'pt-BR', currency: string = 'BRL'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value)
}

/**
 * Trunca texto com ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Capitaliza primeira letra
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/**
 * Formata label de ação de auditoria
 */
export function formatAuditAction(action: string): string {
  const labels: Record<string, string> = {
    CREATE: 'Criação',
    UPDATE: 'Atualização',
    DELETE: 'Exclusão',
    INACTIVE: 'Inativação',
  }
  return labels[action] || action
}

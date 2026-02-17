/**
 * @file src/shared/services/sanitizer.ts
 * 
 * Wrapper de sanitização usando DOMPurify
 * 
 * Decisão de design:
 * - Centraliza sanitização para evitar XSS
 * - Todo conteúdo dinâmico (vindo da API) deve passar por aqui
 * - Configuração default segura, customizável por uso
 */

import DOMPurify from 'dompurify'

/**
 * Sanitiza HTML para prevenir XSS
 * Remove scripts, event handlers e conteúdo perigoso
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  })
}

/**
 * Sanitiza texto puro (strip all HTML)
 */
export function sanitizeText(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  })
}

/**
 * Verifica se string contém conteúdo potencialmente perigoso
 */
export function isDangerousContent(content: string): boolean {
  const sanitized = sanitizeText(content)
  return sanitized !== content
}

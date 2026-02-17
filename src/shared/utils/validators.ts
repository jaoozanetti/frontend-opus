/**
 * @file src/shared/utils/validators.ts
 * 
 * Funções de validação reutilizáveis
 */

import { PATTERNS } from '@core/config'

export function isValidEmail(email: string): boolean {
  return PATTERNS.EMAIL.test(email)
}

export function isValidPassword(password: string): boolean {
  return (
    password.length >= PATTERNS.PASSWORD_MIN_LENGTH &&
    PATTERNS.PASSWORD_REGEX.test(password)
  )
}

export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0
}

export function isMinLength(value: string, minLength: number): boolean {
  return value.trim().length >= minLength
}

export function isMaxLength(value: string, maxLength: number): boolean {
  return value.trim().length <= maxLength
}

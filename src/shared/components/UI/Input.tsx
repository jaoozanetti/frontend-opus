/**
 * @file src/shared/components/UI/Input.tsx
 * 
 * Input reutilizável com label e validação
 */

import { InputHTMLAttributes, forwardRef, useId } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id: externalId, ...props }, ref) => {
    const internalId = useId()
    const inputId = externalId || internalId

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium"
            style={{ color: 'var(--color-foreground)' }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`h-10 w-full rounded-lg border px-3 text-sm transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-red-500 focus:ring-red-500/20' : 'focus:ring-[var(--color-primary)]/20'} ${className}`}
          style={{
            backgroundColor: 'var(--color-background)',
            color: 'var(--color-foreground)',
            borderColor: error ? undefined : 'var(--color-border)',
          }}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

/**
 * @file src/shared/components/UI/Button.tsx
 * 
 * Botão reutilizável com variants (SaaS moderno)
 */

import { ButtonHTMLAttributes, forwardRef } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'text-white shadow-sm hover:opacity-90',
  secondary: 'text-white shadow-sm hover:opacity-90',
  outline: 'border-2 bg-transparent hover:opacity-80',
  ghost: 'bg-transparent hover:opacity-80',
  destructive: 'text-white shadow-sm hover:opacity-90',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs rounded-md',
  md: 'h-10 px-4 text-sm rounded-lg',
  lg: 'h-12 px-6 text-base rounded-lg',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, fullWidth, className = '', disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const dynamicStyles: Record<string, string> = {
      primary: 'focus:ring-[var(--color-primary)]',
      secondary: 'focus:ring-[var(--color-secondary)]',
      outline: 'border-[var(--color-border)] focus:ring-[var(--color-primary)]',
      ghost: 'focus:ring-[var(--color-primary)]',
      destructive: 'focus:ring-[var(--color-destructive)]',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${dynamicStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
        style={{
          backgroundColor:
            variant === 'primary' ? 'var(--color-primary)' :
            variant === 'secondary' ? 'var(--color-secondary)' :
            variant === 'destructive' ? 'var(--color-destructive)' :
            undefined,
          borderColor:
            variant === 'outline' ? 'var(--color-border)' : undefined,
          color:
            variant === 'outline' || variant === 'ghost' ? 'var(--color-foreground)' : undefined,
        }}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Carregando...
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

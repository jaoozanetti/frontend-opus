/**
 * @file src/shared/components/Layout/PageContainer.tsx
 * 
 * Container padrão para páginas (padding, max-width, etc)
 */

import { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
  title?: string
  description?: string
  action?: ReactNode
  className?: string
}

export function PageContainer({
  children,
  title,
  description,
  action,
  className = '',
}: PageContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 ${className}`}>
      {(title || action) && (
        <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && (
              <h1
                className="text-2xl font-bold tracking-tight"
                style={{ color: 'var(--color-foreground)' }}
              >
                {title}
              </h1>
            )}
            {description && (
              <p className="mt-1 text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                {description}
              </p>
            )}
          </div>
          {action && <div className="mt-3 sm:mt-0">{action}</div>}
        </div>
      )}
      <div className="animate-fade-in">{children}</div>
    </div>
  )
}

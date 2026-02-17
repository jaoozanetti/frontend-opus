/**
 * @file src/shared/components/Layout/AdminHeader.tsx
 * 
 * Header do Admin (Backoffice)
 * Estilo limpo e moderno
 */

import { useTenant } from '@shared/hooks/useTenant'

interface AdminHeaderProps {
  title?: string
}

export function AdminHeader({ title }: AdminHeaderProps) {
  const { tenant } = useTenant()

  return (
    <header
      className="sticky top-0 z-30 flex h-[var(--header-height)] items-center border-b px-4 lg:px-6"
      style={{
        backgroundColor: 'var(--color-background)',
        borderColor: 'var(--color-border)',
      }}
    >
      {/* Spacer para hamburger menu no mobile */}
      <div className="w-10 lg:hidden" />

      <h2
        className="text-lg font-semibold"
        style={{ color: 'var(--color-foreground)' }}
      >
        {title || tenant?.brand.name || 'Admin'}
      </h2>
    </header>
  )
}

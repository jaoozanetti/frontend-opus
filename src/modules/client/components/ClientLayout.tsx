/**
 * @file src/modules/client/components/ClientLayout.tsx
 * 
 * Layout do Client com Bottom Navigation (mobile-first)
 */

import { Outlet } from 'react-router-dom'
import { ClientBottomNav } from '@shared/components/Layout/ClientBottomNav'
import { useAuth } from '@shared/hooks/useAuth'
import { useTenant } from '@shared/hooks/useTenant'
import { useTheme } from '@shared/hooks/useTheme'
import { useNavigate } from 'react-router-dom'

export function ClientLayout() {
  const { user, logout } = useAuth()
  const { tenant } = useTenant()
  const { isDarkMode, toggleDarkMode } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen pb-[var(--bottom-nav-height)] lg:pb-0" style={{ backgroundColor: 'var(--color-muted)' }}>
      {/* Top header (simple) */}
      <header
        className="sticky top-0 z-30 flex h-14 items-center justify-between border-b px-4"
        style={{
          backgroundColor: 'var(--color-background)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg text-sm font-bold text-white"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {tenant?.brand.name.charAt(0) || 'S'}
          </div>
          <span className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>
            {tenant?.brand.name || 'SaaS'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="text-sm"
            title={isDarkMode ? 'Modo claro' : 'Modo escuro'}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          {/* Desktop nav */}
          <span className="hidden text-xs lg:inline" style={{ color: 'var(--color-muted-foreground)' }}>
            {user?.name}
          </span>
          <button
            onClick={handleLogout}
            className="hidden text-xs lg:inline hover:opacity-70"
            style={{ color: 'var(--color-destructive)' }}
          >
            Sair
          </button>
        </div>
      </header>

      {/* Content */}
      <main>
        <Outlet />
      </main>

      {/* Bottom navigation (mobile) */}
      <ClientBottomNav />
    </div>
  )
}

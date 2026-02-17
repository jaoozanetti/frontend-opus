/**
 * @file src/shared/components/Layout/AdminSidebar.tsx
 * 
 * Sidebar do Admin (Backoffice)
 * Estilo SaaS moderno (Stripe/Linear)
 * Responsiva: drawer em mobile, fixa em desktop
 */

import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@shared/hooks/useAuth'
import { useTenant } from '@shared/hooks/useTenant'
import { useTheme } from '@shared/hooks/useTheme'
import { ADMIN_ROUTES } from '@/routes/RouteConfig'

function NavIcon({ icon }: { icon: string }) {
  const icons: Record<string, string> = {
    dashboard: '📊',
    users: '👥',
    building: '🏢',
    audit: '📋',
    shield: '🛡️',
    settings: '⚙️',
  }
  return <span className="text-base">{icons[icon] || '📄'}</span>
}

export function AdminSidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { user, logout, hasPermission } = useAuth()
  const { tenant } = useTenant()
  const { isDarkMode, toggleDarkMode } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const visibleRoutes = ADMIN_ROUTES.filter((route) => {
    if (!route.showInNav) return false
    if (route.requiredPermission && !hasPermission(route.requiredPermission)) return false
    return true
  })

  const sidebarContent = (
    <div
      className="flex h-full flex-col"
      style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
    >
      {/* Logo / Brand */}
      <div
        className="flex h-16 items-center gap-3 border-b px-5"
        style={{ borderColor: 'var(--color-border)' }}
      >
        {tenant?.brand.logoUrl && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--color-primary)' }}>
            <span className="text-sm font-bold text-white">
              {tenant.brand.name.charAt(0)}
            </span>
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>
            {tenant?.brand.name || 'SaaS Platform'}
          </span>
          <span className="text-[10px]" style={{ color: 'var(--color-muted-foreground)' }}>
            Backoffice
          </span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {visibleRoutes.map((route) => (
          <NavLink
            key={route.path}
            to={route.path}
            end={route.path === '/admin'}
            onClick={() => setIsMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'shadow-sm'
                  : 'hover:opacity-80'
              }`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'var(--color-muted)' : 'transparent',
              color: isActive ? 'var(--color-foreground)' : 'var(--color-muted-foreground)',
            })}
          >
            {route.icon && <NavIcon icon={route.icon} />}
            {route.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer: user info + dark mode */}
      <div
        className="border-t px-3 py-3"
        style={{ borderColor: 'var(--color-border)' }}
      >
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:opacity-80"
          style={{ color: 'var(--color-muted-foreground)' }}
        >
          <span>{isDarkMode ? '☀️' : '🌙'}</span>
          {isDarkMode ? 'Modo claro' : 'Modo escuro'}
        </button>

        {/* User info */}
        <div
          className="mt-2 flex items-center justify-between rounded-lg px-3 py-2"
          style={{ backgroundColor: 'var(--color-muted)' }}
        >
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium" style={{ color: 'var(--color-foreground)' }}>
                {user?.name}
              </span>
              <span className="text-[10px]" style={{ color: 'var(--color-muted-foreground)' }}>
                {user?.profile.name}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs hover:opacity-70 transition-opacity"
            style={{ color: 'var(--color-destructive)' }}
            title="Sair"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-lg shadow-lg lg:hidden"
        style={{
          backgroundColor: 'var(--color-background)',
          color: 'var(--color-foreground)',
          borderColor: 'var(--color-border)',
          border: '1px solid',
        }}
      >
        ☰
      </button>

      {/* Mobile drawer overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[var(--sidebar-width)] transform border-r transition-transform duration-300 lg:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ borderColor: 'var(--color-border)' }}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar (fixed) */}
      <aside
        className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-[var(--sidebar-width)] lg:border-r"
        style={{ borderColor: 'var(--color-border)' }}
      >
        {sidebarContent}
      </aside>
    </>
  )
}

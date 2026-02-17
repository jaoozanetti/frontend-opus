/**
 * @file src/shared/components/Layout/ClientBottomNav.tsx
 * 
 * Bottom Navigation para área Client (mobile-first)
 * Estilo moderno com safe-area para notch/barra gestual
 */

import { NavLink } from 'react-router-dom'
import { CLIENT_ROUTES } from '@/routes/RouteConfig'

function NavIcon({ icon, isActive }: { icon: string; isActive: boolean }) {
  const icons: Record<string, string> = {
    home: '🏠',
    dashboard: '📊',
    user: '👤',
    settings: '⚙️',
  }
  return (
    <span className={`text-xl transition-transform ${isActive ? 'scale-110' : ''}`}>
      {icons[icon] || '📄'}
    </span>
  )
}

export function ClientBottomNav() {
  const navRoutes = CLIENT_ROUTES.filter((r) => r.showInNav)

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t pb-safe lg:hidden"
      style={{
        backgroundColor: 'var(--color-background)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="flex h-[var(--bottom-nav-height)] items-center justify-around">
        {navRoutes.map((route) => (
          <NavLink
            key={route.path}
            to={route.path}
            end={route.path === '/app'}
            className="flex flex-col items-center gap-0.5 px-3 py-1"
          >
            {({ isActive }) => (
              <>
                {route.icon && <NavIcon icon={route.icon} isActive={isActive} />}
                <span
                  className={`text-[10px] font-medium ${isActive ? '' : ''}`}
                  style={{
                    color: isActive ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
                  }}
                >
                  {route.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

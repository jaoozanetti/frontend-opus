/**
 * @file src/modules/admin/components/AdminLayout.tsx
 * 
 * Layout do Admin com Sidebar + Outlet
 */

import { Outlet } from 'react-router-dom'
import { AdminSidebar } from '@shared/components/Layout/AdminSidebar'

export function AdminLayout() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-muted)' }}>
      <AdminSidebar />

      {/* Main content area (offset by sidebar width on desktop) */}
      <main className="lg:ml-[var(--sidebar-width)]">
        <Outlet />
      </main>
    </div>
  )
}

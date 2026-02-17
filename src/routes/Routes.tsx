/**
 * @file src/routes/Routes.tsx
 * 
 * Definição das rotas da aplicação
 * 
 * Fluxo:
 * 1. Rotas públicas: /login, /register, /forgot-password
 * 2. Rotas admin: /admin/* (ProtectedRoute com permissões)
 * 3. Rotas client: /app/* (ProtectedRoute básico)
 * 4. Redirect: / → admin ou client baseado no perfil
 */

import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@shared/hooks'
import { ProtectedRoute } from './ProtectedRoute'

// ──────────────────────────────
// Auth pages (lazy loading no futuro)
// ──────────────────────────────
import { LoginPage } from '@modules/auth/pages/Login'

// ──────────────────────────────
// Admin pages
// ──────────────────────────────
import { AdminLayout } from '@modules/admin/components/AdminLayout'
import { AdminDashboard } from '@modules/admin/pages/Dashboard'
import { UsersPage } from '@modules/admin/pages/Users'
import { AuditPage } from '@modules/admin/pages/Audit'
import { AdminSettings } from '@modules/admin/pages/Settings'

// ──────────────────────────────
// Client pages
// ──────────────────────────────
import { ClientLayout } from '@modules/client/components/ClientLayout'
import { ClientHome } from '@modules/client/pages/Home'
import { ClientDashboard } from '@modules/client/pages/Dashboard'
import { ClientProfile } from '@modules/client/pages/Profile'
import { ClientSettings } from '@modules/client/pages/Settings'

/**
 * Componente que redireciona baseado no perfil do usuário
 */
function RootRedirect() {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Se tem permissões de admin, vai para admin
  const isAdmin = user?.profile.permissions.some(
    (p) => p.module === 'tenants' || p.module === 'profiles'
  )

  return <Navigate to={isAdmin ? '/admin' : '/app'} replace />
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Redirect root */}
      <Route path="/" element={<RootRedirect />} />

      {/* Auth routes (públicas) */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin routes (protegidas) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route
          path="users"
          element={
            <ProtectedRoute requiredPermission="users.view">
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="audit"
          element={
            <ProtectedRoute requiredPermission="audit.view">
              <AuditPage />
            </ProtectedRoute>
          }
        />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Client routes (protegidas) */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <ClientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ClientHome />} />
        <Route path="dashboard" element={<ClientDashboard />} />
        <Route path="profile" element={<ClientProfile />} />
        <Route path="settings" element={<ClientSettings />} />
      </Route>

      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="flex h-screen w-full items-center justify-center">
            <div className="text-center animate-fade-in">
              <h1 className="text-6xl font-bold" style={{ color: 'var(--color-muted-foreground)' }}>404</h1>
              <p className="mt-2 text-lg" style={{ color: 'var(--color-muted-foreground)' }}>Página não encontrada</p>
            </div>
          </div>
        }
      />
    </Routes>
  )
}

/**
 * @file src/routes/RouteConfig.ts
 * 
 * Definição das rotas da aplicação
 * 
 * Decisão de design:
 * - Rotas separadas por área (admin, client, auth)
 * - Cada rota pode ter permissão necessária
 * - Rotas protegidas são envolvidas por ProtectedRoute
 */

export interface RouteDefinition {
  path: string
  label: string
  icon?: string
  requiredPermission?: string
  showInNav?: boolean
}

/**
 * Rotas de autenticação (públicas)
 */
export const AUTH_ROUTES: RouteDefinition[] = [
  { path: '/login', label: 'Login' },
  { path: '/register', label: 'Cadastro' },
  { path: '/forgot-password', label: 'Esqueci a senha' },
  { path: '/reset-password', label: 'Redefinir senha' },
]

/**
 * Rotas do Admin (protegidas)
 */
export const ADMIN_ROUTES: RouteDefinition[] = [
  { path: '/admin', label: 'Dashboard', icon: 'dashboard', showInNav: true },
  { path: '/admin/users', label: 'Usuários', icon: 'users', requiredPermission: 'users.view', showInNav: true },
  { path: '/admin/users/:userId', label: 'Detalhe Usuário', requiredPermission: 'users.view' },
  { path: '/admin/tenants', label: 'Tenants', icon: 'building', requiredPermission: 'tenants.view', showInNav: true },
  { path: '/admin/audit', label: 'Auditoria', icon: 'audit', requiredPermission: 'audit.view', showInNav: true },
  { path: '/admin/profiles', label: 'Perfis', icon: 'shield', requiredPermission: 'profiles.view', showInNav: true },
  { path: '/admin/settings', label: 'Configurações', icon: 'settings', showInNav: true },
]

/**
 * Rotas do Client (protegidas)
 */
export const CLIENT_ROUTES: RouteDefinition[] = [
  { path: '/app', label: 'Home', icon: 'home', showInNav: true },
  { path: '/app/dashboard', label: 'Dashboard', icon: 'dashboard', showInNav: true },
  { path: '/app/profile', label: 'Perfil', icon: 'user', showInNav: true },
  { path: '/app/settings', label: 'Configurações', icon: 'settings', showInNav: true },
]

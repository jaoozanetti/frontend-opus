/**
 * @file src/shared/types/auth.ts
 * 
 * Tipos de autenticação, usuários e permissões (RBAC dinâmico)
 * 
 * Design:
 * - Perfis de usuário dinâmicos com permissões granulares
 * - Permissões baseadas em módulos e ações (CREATE, READ, UPDATE, DELETE)
 * - Access Token em memória, Refresh Token em httpOnly cookie
 */

export interface Permission {
  id: string
  code: string                    // 'users.create', 'tenants.view'
  module: string                  // 'users', 'tenants', 'reports'
  action: string                  // 'create', 'read', 'update', 'delete'
  description: string
  createdAt: string
}

export interface UserProfile {
  id: string
  name: string
  description: string
  permissions: Permission[]
  createdAt: string
  updatedAt: string
}

export interface AuthUser {
  id: string
  email: string
  name: string
  tenantId: string
  profileId: string
  profile: UserProfile
  lastLoginAt: string
  createdAt: string
}

export interface AuthContextType {
  user: AuthUser | null
  permissions: Permission[]
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  login: (email: string, password: string, tenantId: string) => Promise<void>
  logout: () => void
  refreshAccessToken: () => Promise<void>
  hasPermission: (permissionCode: string) => boolean
  hasAnyPermission: (permissionCodes: string[]) => boolean
  hasAllPermissions: (permissionCodes: string[]) => boolean
}

export interface LoginRequest {
  email: string
  password: string
  tenantId: string
}

export interface LoginResponse {
  user: AuthUser
  accessToken: string
  refreshToken: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
}

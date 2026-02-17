/**
 * @file src/core/mocks/data/users.ts
 * 
 * Dados mock de usuários, perfis e permissões
 */

import { AuthUser, UserProfile, Permission } from '@shared/types'

/** Permissões default do sistema */
export const mockPermissions: Permission[] = [
  // Users
  { id: 'perm-01', code: 'users.view', module: 'users', action: 'read', description: 'Visualizar usuários', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'perm-02', code: 'users.create', module: 'users', action: 'create', description: 'Criar usuários', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'perm-03', code: 'users.update', module: 'users', action: 'update', description: 'Editar usuários', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'perm-04', code: 'users.delete', module: 'users', action: 'delete', description: 'Deletar usuários', createdAt: '2024-01-01T00:00:00Z' },
  // Tenants
  { id: 'perm-05', code: 'tenants.view', module: 'tenants', action: 'read', description: 'Visualizar tenants', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'perm-06', code: 'tenants.create', module: 'tenants', action: 'create', description: 'Criar tenants', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'perm-07', code: 'tenants.update', module: 'tenants', action: 'update', description: 'Editar tenants', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'perm-08', code: 'tenants.delete', module: 'tenants', action: 'delete', description: 'Deletar tenants', createdAt: '2024-01-01T00:00:00Z' },
  // Audit
  { id: 'perm-09', code: 'audit.view', module: 'audit', action: 'read', description: 'Visualizar auditoria', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'perm-10', code: 'audit.export', module: 'audit', action: 'read', description: 'Exportar auditoria', createdAt: '2024-01-01T00:00:00Z' },
  // Profiles
  { id: 'perm-11', code: 'profiles.view', module: 'profiles', action: 'read', description: 'Visualizar perfis', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'perm-12', code: 'profiles.manage', module: 'profiles', action: 'update', description: 'Gerenciar perfis', createdAt: '2024-01-01T00:00:00Z' },
]

/** Perfis default */
export const mockProfiles: UserProfile[] = [
  {
    id: 'profile-admin',
    name: 'Administrador',
    description: 'Acesso total ao sistema',
    permissions: mockPermissions,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-15T10:30:00Z',
  },
  {
    id: 'profile-user',
    name: 'Usuário',
    description: 'Acesso ao módulo client apenas',
    permissions: mockPermissions.filter((p) => p.module === 'users' && p.action === 'read'),
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-15T10:30:00Z',
  },
]

/** Usuários mock */
export const mockUsers: AuthUser[] = [
  {
    id: 'user-001',
    email: 'admin@acme.com',
    name: 'Admin Acme',
    tenantId: 'tenant-001',
    profileId: 'profile-admin',
    profile: mockProfiles[0],
    lastLoginAt: '2024-08-01T12:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-002',
    email: 'user@acme.com',
    name: 'Usuário Acme',
    tenantId: 'tenant-001',
    profileId: 'profile-user',
    profile: mockProfiles[1],
    lastLoginAt: '2024-08-01T14:00:00Z',
    createdAt: '2024-02-01T00:00:00Z',
  },
]

export function findUserByEmail(email: string): AuthUser | undefined {
  return mockUsers.find((u) => u.email === email)
}

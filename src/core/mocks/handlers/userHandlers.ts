/**
 * @file src/core/mocks/handlers/userHandlers.ts
 * 
 * Handlers mock para endpoints de usuários
 */

import { MockHandler } from '@core/adapters'
import { mockUsers, mockProfiles, mockPermissions } from '@core/mocks/data'

export const userHandlers: MockHandler[] = [
  {
    method: 'GET',
    path: '/users',
    handler: () => ({
      success: true,
      data: mockUsers,
      meta: {
        page: 1,
        limit: 20,
        total: mockUsers.length,
        totalPages: 1,
      },
      timestamp: new Date().toISOString(),
    }),
  },
  {
    method: 'GET',
    path: /^\/users\/[^/]+$/,
    handler: () => ({
      success: true,
      data: mockUsers[0],
      timestamp: new Date().toISOString(),
    }),
  },
  {
    method: 'POST',
    path: '/users',
    handler: (data?: unknown) => ({
      success: true,
      data: {
        id: 'user-' + Date.now(),
        ...(data as Record<string, unknown>),
        createdAt: new Date().toISOString(),
      },
      message: 'Usuário criado com sucesso',
      timestamp: new Date().toISOString(),
    }),
  },
  {
    method: 'PUT',
    path: /^\/users\/[^/]+$/,
    handler: (data?: unknown) => ({
      success: true,
      data: {
        ...mockUsers[0],
        ...(data as Record<string, unknown>),
        updatedAt: new Date().toISOString(),
      },
      message: 'Usuário atualizado com sucesso',
      timestamp: new Date().toISOString(),
    }),
  },
  {
    method: 'DELETE',
    path: /^\/users\/[^/]+$/,
    handler: () => ({
      success: true,
      data: null,
      message: 'Usuário removido com sucesso',
      timestamp: new Date().toISOString(),
    }),
  },
  // Profiles endpoints
  {
    method: 'GET',
    path: '/profiles',
    handler: () => ({
      success: true,
      data: mockProfiles,
      timestamp: new Date().toISOString(),
    }),
  },
  {
    method: 'GET',
    path: /^\/profiles\/[^/]+$/,
    handler: () => ({
      success: true,
      data: mockProfiles[0],
      timestamp: new Date().toISOString(),
    }),
  },
  // Permissions endpoints
  {
    method: 'GET',
    path: '/permissions',
    handler: () => ({
      success: true,
      data: mockPermissions,
      timestamp: new Date().toISOString(),
    }),
  },
]

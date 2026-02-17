/**
 * @file src/core/mocks/data/tenants.ts
 * 
 * Dados mock de tenants para desenvolvimento
 */

import { Tenant } from '@shared/types'

export const mockTenants: Tenant[] = [
  {
    id: 'tenant-001',
    name: 'Acme Corp',
    slug: 'acme',
    brand: {
      name: 'Acme Platform',
      logoUrl: '/mocklogo-acme.svg',
      faviconUrl: '/favicon-acme.ico',
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      darkModeEnabled: true,
      description: 'Plataforma Acme para gestão empresarial',
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-15T10:30:00Z',
  },
  {
    id: 'tenant-002',
    name: 'Beta Inc',
    slug: 'beta',
    brand: {
      name: 'Beta Suite',
      logoUrl: '/mocklogo-beta.svg',
      faviconUrl: '/favicon-beta.ico',
      primaryColor: '#8B5CF6',
      secondaryColor: '#F97316',
      darkModeEnabled: true,
      description: 'Beta Suite - Soluções digitais',
    },
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-07-20T14:00:00Z',
  },
]

export function findTenantBySlug(slug: string): Tenant | undefined {
  return mockTenants.find((t) => t.slug === slug)
}

export function findTenantById(id: string): Tenant | undefined {
  return mockTenants.find((t) => t.id === id)
}

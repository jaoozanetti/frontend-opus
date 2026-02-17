/**
 * @file src/modules/admin/pages/Dashboard.tsx
 * 
 * Dashboard do Admin - dados reais da API
 */

import { useEffect, useState } from 'react'
import { PageContainer } from '@shared/components/Layout/PageContainer'
import { Card, CardHeader } from '@shared/components/UI/Card'
import { useAuth } from '@shared/hooks'
import { listUsers } from '@shared/services/userService'
import { listClients } from '@shared/services/clientService'
import { listProducts } from '@shared/services/productService'
import { listSales } from '@shared/services/saleService'

export function AdminDashboard() {
  const { user } = useAuth()
  const [counts, setCounts] = useState({ users: 0, clients: 0, products: 0, sales: 0 })

  useEffect(() => {
    async function loadCounts() {
      try {
        const [users, clients, products, sales] = await Promise.all([
          listUsers(),
          listClients(),
          listProducts(1, 1),
          listSales(1, 1),
        ])
        setCounts({
          users: users.length,
          clients: clients.length,
          products: products.meta.totalItems,
          sales: sales.meta.totalItems,
        })
      } catch (err) {
        console.error('Erro ao carregar dados do dashboard:', err)
      }
    }
    loadCounts()
  }, [])

  return (
    <PageContainer
      title="Dashboard"
      description={`Bem-vindo, ${user?.name || 'Administrador'}`}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader title="Usuários" description="Cadastrados no sistema" />
          <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
            {counts.users}
          </p>
        </Card>
        <Card>
          <CardHeader title="Clientes" description="Clientes cadastrados" />
          <p className="text-3xl font-bold" style={{ color: 'var(--color-foreground)' }}>
            {counts.clients}
          </p>
        </Card>
        <Card>
          <CardHeader title="Produtos" description="Produtos no catálogo" />
          <p className="text-3xl font-bold" style={{ color: 'var(--color-foreground)' }}>
            {counts.products}
          </p>
        </Card>
        <Card>
          <CardHeader title="Vendas" description="Total de vendas realizadas" />
          <p className="text-3xl font-bold" style={{ color: 'var(--color-secondary)' }}>
            {counts.sales}
          </p>
        </Card>
      </div>
    </PageContainer>
  )
}

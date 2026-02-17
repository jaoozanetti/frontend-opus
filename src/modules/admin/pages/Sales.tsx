/**
 * @file src/modules/admin/pages/Sales.tsx
 * 
 * Página de gerenciamento de vendas
 * CRUD consumindo /api/sales com paginação
 */

import { useEffect, useState, useCallback, FormEvent } from 'react'
import { PageContainer } from '@shared/components/Layout/PageContainer'
import { Card } from '@shared/components/UI/Card'
import { Button } from '@shared/components/UI/Button'
import { Input } from '@shared/components/UI/Input'
import { Modal } from '@shared/components/UI/Modal'
import { Badge } from '@shared/components/UI/Badge'
import { SaleResponse, PaginatedSaleResponse, Client, Product, CreateSaleRequest, CreateSaleItemRequest } from '@shared/types'
import { listSales, createSale, deleteSale } from '@shared/services/saleService'
import { listClients } from '@shared/services/clientService'
import { listProducts } from '@shared/services/productService'
import { formatCurrency, formatDate } from '@shared/utils'

interface SaleItemForm {
  productId: number
  amount: number
}

export function SalesPage() {
  const [sales, setSales] = useState<SaleResponse[]>([])
  const [meta, setMeta] = useState<PaginatedSaleResponse['meta'] | null>(null)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [detailSale, setDetailSale] = useState<SaleResponse | null>(null)
  const [formClientId, setFormClientId] = useState('')
  const [formItems, setFormItems] = useState<SaleItemForm[]>([{ productId: 0, amount: 1 }])
  const [formError, setFormError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Dados auxiliares para selects
  const [clients, setClients] = useState<Client[]>([])
  const [products, setProducts] = useState<Product[]>([])

  const loadSales = useCallback(async (p = page) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await listSales(p, 10)
      setSales(result.data)
      setMeta(result.meta)
    } catch (err) {
      setError('Erro ao carregar vendas')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [page])

  useEffect(() => { loadSales() }, [loadSales])

  const loadAuxData = useCallback(async () => {
    try {
      const [clientsData, productsData] = await Promise.all([
        listClients(),
        listProducts(1, 100),
      ])
      setClients(clientsData)
      setProducts(productsData.data)
    } catch (err) {
      console.error('Erro ao carregar dados auxiliares:', err)
    }
  }, [])

  const openCreateModal = async () => {
    await loadAuxData()
    setFormClientId('')
    setFormItems([{ productId: 0, amount: 1 }])
    setFormError(null)
    setIsModalOpen(true)
  }

  const openDetailModal = (sale: SaleResponse) => {
    setDetailSale(sale)
    setIsDetailOpen(true)
  }

  const addItem = () => {
    setFormItems([...formItems, { productId: 0, amount: 1 }])
  }

  const removeItem = (index: number) => {
    if (formItems.length > 1) {
      setFormItems(formItems.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index: number, field: keyof SaleItemForm, value: number) => {
    const updated = [...formItems]
    updated[index] = { ...updated[index], [field]: value }
    setFormItems(updated)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!formClientId) {
      setFormError('Selecione um cliente')
      return
    }

    const invalidItems = formItems.some(item => !item.productId || item.amount < 1)
    if (invalidItems) {
      setFormError('Preencha todos os itens corretamente')
      return
    }

    setIsSaving(true)

    try {
      const items: CreateSaleItemRequest[] = formItems.map(item => ({
        productId: item.productId,
        amount: item.amount,
      }))

      const data: CreateSaleRequest = {
        clientId: Number(formClientId),
        items,
      }

      await createSale(data)
      setIsModalOpen(false)
      await loadSales()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message
      setFormError(Array.isArray(msg) ? msg.join(', ') : (msg as string) || 'Erro ao criar venda')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja cancelar esta venda? O estoque será estornado.')) return
    try {
      await deleteSale(id)
      await loadSales()
    } catch (err) {
      console.error('Erro ao cancelar venda:', err)
    }
  }

  const goToPage = (p: number) => {
    setPage(p)
    loadSales(p)
  }

  return (
    <PageContainer
      title="Vendas"
      description="Gerencie as vendas realizadas"
      action={
        <Button variant="primary" size="sm" onClick={openCreateModal}>
          + Nova Venda
        </Button>
      }
    >
      <Card padding="sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[var(--color-primary)]" />
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p style={{ color: 'var(--color-destructive)' }}>{error}</p>
            <Button variant="outline" size="sm" onClick={() => loadSales()} className="mt-4">Tentar novamente</Button>
          </div>
        ) : sales.length === 0 ? (
          <div className="py-12 text-center">
            <p style={{ color: 'var(--color-muted-foreground)' }}>Nenhuma venda registrada</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left" style={{ borderColor: 'var(--color-border)' }}>
                    <th className="px-4 py-3 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>ID</th>
                    <th className="px-4 py-3 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Data</th>
                    <th className="px-4 py-3 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Cliente</th>
                    <th className="px-4 py-3 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Itens</th>
                    <th className="px-4 py-3 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Total</th>
                    <th className="px-4 py-3 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale) => (
                    <tr key={sale.id} className="border-b transition-colors hover:opacity-80" style={{ borderColor: 'var(--color-border)' }}>
                      <td className="px-4 py-3" style={{ color: 'var(--color-muted-foreground)' }}>{sale.id}</td>
                      <td className="px-4 py-3" style={{ color: 'var(--color-foreground)' }}>{formatDate(sale.date)}</td>
                      <td className="px-4 py-3" style={{ color: 'var(--color-foreground)' }}>{sale.clientName}</td>
                      <td className="px-4 py-3">
                        <Badge variant="info">{sale.items.length} {sale.items.length === 1 ? 'item' : 'itens'}</Badge>
                      </td>
                      <td className="px-4 py-3 font-semibold" style={{ color: 'var(--color-primary)' }}>{formatCurrency(Number(sale.total))}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openDetailModal(sale)}>Detalhes</Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(sale.id)} className="text-red-500 hover:text-red-600">Cancelar</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between border-t px-4 py-3" style={{ borderColor: 'var(--color-border)' }}>
                <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                  {meta.totalItems} vendas | Página {meta.currentPage} de {meta.totalPages}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => goToPage(page - 1)}>Anterior</Button>
                  <Button variant="outline" size="sm" disabled={page >= meta.totalPages} onClick={() => goToPage(page + 1)}>Próxima</Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Modal Nova Venda */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Venda"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Seleção do cliente */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>Cliente</label>
            <select
              value={formClientId}
              onChange={(e) => setFormClientId(e.target.value)}
              className="h-10 w-full rounded-lg border px-3 text-sm"
              style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)', borderColor: 'var(--color-border)' }}
              required
            >
              <option value="">Selecione um cliente...</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.cpf})</option>
              ))}
            </select>
          </div>

          {/* Itens da venda */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>Itens</label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>+ Item</Button>
            </div>

            {formItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <select
                  value={item.productId || ''}
                  onChange={(e) => updateItem(index, 'productId', Number(e.target.value))}
                  className="h-10 flex-1 rounded-lg border px-3 text-sm"
                  style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)', borderColor: 'var(--color-border)' }}
                  required
                >
                  <option value="">Produto...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} - {formatCurrency(Number(p.price))} (estoque: {p.stock})</option>
                  ))}
                </select>
                <Input
                  type="number"
                  min="1"
                  value={String(item.amount)}
                  onChange={(e) => updateItem(index, 'amount', Number(e.target.value))}
                  className="w-20"
                  required
                />
                {formItems.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)} className="text-red-500">✕</Button>
                )}
              </div>
            ))}
          </div>

          {formError && (
            <div className="rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-destructive)' }}>
              {formError}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t pt-4" style={{ borderColor: 'var(--color-border)' }}>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit" isLoading={isSaving}>Criar Venda</Button>
          </div>
        </form>
      </Modal>

      {/* Modal Detalhes da Venda */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={`Venda #${detailSale?.id}`}
      >
        {detailSale && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4 text-sm" style={{ color: 'var(--color-foreground)' }}>
              <div>
                <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>Cliente</p>
                <p className="font-medium">{detailSale.clientName}</p>
              </div>
              <div>
                <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>Data</p>
                <p className="font-medium">{formatDate(detailSale.date)}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <th className="px-3 py-2 text-left font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Produto</th>
                    <th className="px-3 py-2 text-right font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Qtd</th>
                    <th className="px-3 py-2 text-right font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Unit.</th>
                    <th className="px-3 py-2 text-right font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {detailSale.items.map((item, i) => (
                    <tr key={i} className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                      <td className="px-3 py-2" style={{ color: 'var(--color-foreground)' }}>{item.productName}</td>
                      <td className="px-3 py-2 text-right" style={{ color: 'var(--color-foreground)' }}>{item.amount}</td>
                      <td className="px-3 py-2 text-right" style={{ color: 'var(--color-muted-foreground)' }}>{formatCurrency(Number(item.unitPrice))}</td>
                      <td className="px-3 py-2 text-right font-medium" style={{ color: 'var(--color-foreground)' }}>{formatCurrency(Number(item.subtotal))}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="px-3 py-2 text-right font-semibold" style={{ color: 'var(--color-foreground)' }}>Total:</td>
                    <td className="px-3 py-2 text-right font-bold text-lg" style={{ color: 'var(--color-primary)' }}>
                      {formatCurrency(Number(detailSale.total))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  )
}

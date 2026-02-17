/**
 * @file src/modules/admin/pages/Products.tsx
 * 
 * Página de gerenciamento de produtos
 * CRUD completo consumindo /api/products com paginação
 */

import { useEffect, useState, useCallback, FormEvent } from 'react'
import { PageContainer } from '@shared/components/Layout/PageContainer'
import { Card } from '@shared/components/UI/Card'
import { Button } from '@shared/components/UI/Button'
import { Input } from '@shared/components/UI/Input'
import { Modal } from '@shared/components/UI/Modal'
import { Product, CreateProductRequest, UpdateProductRequest, PaginatedProductResponse } from '@shared/types'
import { listProducts, createProduct, updateProduct, deleteProduct } from '@shared/services'
import { formatCurrency } from '@shared/utils'

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [meta, setMeta] = useState<PaginatedProductResponse['meta'] | null>(null)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formName, setFormName] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formPrice, setFormPrice] = useState('')
  const [formStock, setFormStock] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const loadProducts = useCallback(async (p = page) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await listProducts(p, 10)
      setProducts(result.data)
      setMeta(result.meta)
    } catch (err) {
      setError('Erro ao carregar produtos')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [page])

  useEffect(() => { loadProducts() }, [loadProducts])

  const openCreateModal = () => {
    setEditingProduct(null)
    setFormName('')
    setFormDescription('')
    setFormPrice('')
    setFormStock('')
    setFormError(null)
    setIsModalOpen(true)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setFormName(product.name)
    setFormDescription(product.description || '')
    setFormPrice(String(product.price))
    setFormStock(String(product.stock))
    setFormError(null)
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setIsSaving(true)

    try {
      if (editingProduct) {
        const data: UpdateProductRequest = {
          name: formName,
          description: formDescription || undefined,
          price: Number(formPrice),
          stock: Number(formStock),
        }
        await updateProduct(editingProduct.id, data)
      } else {
        const data: CreateProductRequest = {
          name: formName,
          description: formDescription || undefined,
          price: Number(formPrice),
          stock: Number(formStock),
        }
        await createProduct(data)
      }
      setIsModalOpen(false)
      await loadProducts()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message
      setFormError(Array.isArray(msg) ? msg.join(', ') : (msg as string) || 'Erro ao salvar produto')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja remover este produto?')) return
    try {
      await deleteProduct(id)
      await loadProducts()
    } catch (err) {
      console.error('Erro ao remover produto:', err)
    }
  }

  const goToPage = (p: number) => {
    setPage(p)
    loadProducts(p)
  }

  return (
    <PageContainer
      title="Produtos"
      description="Gerencie os produtos cadastrados"
      action={
        <Button variant="primary" size="sm" onClick={openCreateModal}>
          + Novo Produto
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
            <Button variant="outline" size="sm" onClick={() => loadProducts()} className="mt-4">Tentar novamente</Button>
          </div>
        ) : products.length === 0 ? (
          <div className="py-12 text-center">
            <p style={{ color: 'var(--color-muted-foreground)' }}>Nenhum produto cadastrado</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left" style={{ borderColor: 'var(--color-border)' }}>
                    <th className="px-4 py-3 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>ID</th>
                    <th className="px-4 py-3 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Nome</th>
                    <th className="px-4 py-3 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Preço</th>
                    <th className="px-4 py-3 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Estoque</th>
                    <th className="px-4 py-3 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b transition-colors hover:opacity-80" style={{ borderColor: 'var(--color-border)' }}>
                      <td className="px-4 py-3" style={{ color: 'var(--color-muted-foreground)' }}>{product.id}</td>
                      <td className="px-4 py-3" style={{ color: 'var(--color-foreground)' }}>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          {product.description && <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>{product.description}</p>}
                        </div>
                      </td>
                      <td className="px-4 py-3" style={{ color: 'var(--color-foreground)' }}>{formatCurrency(Number(product.price))}</td>
                      <td className="px-4 py-3">
                        <span className={`font-medium ${Number(product.stock) <= 5 ? 'text-red-500' : ''}`} style={Number(product.stock) > 5 ? { color: 'var(--color-secondary)' } : undefined}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(product)}>Editar</Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-600">Remover</Button>
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
                  {meta.totalItems} produtos | Página {meta.currentPage} de {meta.totalPages}
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

      {/* Modal Criar/Editar */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Editar Produto' : 'Novo Produto'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Nome" value={formName} onChange={(e) => setFormName(e.target.value)} required autoFocus />
          <Input label="Descrição" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Preço (R$)" type="number" step="0.01" min="0" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} required />
            <Input label="Estoque" type="number" min="0" value={formStock} onChange={(e) => setFormStock(e.target.value)} required />
          </div>

          {formError && (
            <div className="rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-destructive)' }}>
              {formError}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t pt-4" style={{ borderColor: 'var(--color-border)' }}>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit" isLoading={isSaving}>{editingProduct ? 'Salvar' : 'Criar'}</Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  )
}

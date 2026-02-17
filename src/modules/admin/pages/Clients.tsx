/**
 * @file src/modules/admin/pages/Clients.tsx
 * 
 * Página de gerenciamento de clientes
 * CRUD completo consumindo /api/clients
 */

import { useEffect, useState, useCallback, FormEvent } from 'react'
import { PageContainer } from '@shared/components/Layout/PageContainer'
import { Card } from '@shared/components/UI/Card'
import { Button } from '@shared/components/UI/Button'
import { Input } from '@shared/components/UI/Input'
import { Modal } from '@shared/components/UI/Modal'
import { Client, CreateClientRequest, UpdateClientRequest } from '@shared/types'
import { listClients, createClient, updateClient, deleteClient } from '@shared/services'

export function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formCpf, setFormCpf] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const loadClients = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await listClients()
      setClients(data)
    } catch (err) {
      setError('Erro ao carregar clientes')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { loadClients() }, [loadClients])

  const openCreateModal = () => {
    setEditingClient(null)
    setFormName('')
    setFormEmail('')
    setFormCpf('')
    setFormError(null)
    setIsModalOpen(true)
  }

  const openEditModal = (client: Client) => {
    setEditingClient(client)
    setFormName(client.name)
    setFormEmail(client.email)
    setFormCpf(client.cpf)
    setFormError(null)
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setIsSaving(true)

    try {
      if (editingClient) {
        const data: UpdateClientRequest = { name: formName, email: formEmail, cpf: formCpf }
        await updateClient(editingClient.id, data)
      } else {
        const data: CreateClientRequest = { name: formName, email: formEmail, cpf: formCpf }
        await createClient(data)
      }
      setIsModalOpen(false)
      await loadClients()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message
      setFormError(Array.isArray(msg) ? msg.join(', ') : (msg as string) || 'Erro ao salvar cliente')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja remover este cliente?')) return
    try {
      await deleteClient(id)
      await loadClients()
    } catch (err) {
      console.error('Erro ao remover cliente:', err)
    }
  }

  return (
    <PageContainer
      title="Clientes"
      description="Gerencie os clientes cadastrados"
      action={
        <Button variant="primary" size="sm" onClick={openCreateModal}>
          + Novo Cliente
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
            <Button variant="outline" size="sm" onClick={loadClients} className="mt-4">Tentar novamente</Button>
          </div>
        ) : clients.length === 0 ? (
          <div className="py-12 text-center">
            <p style={{ color: 'var(--color-muted-foreground)' }}>Nenhum cliente cadastrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left" style={{ borderColor: 'var(--color-border)' }}>
                  <th className="px-4 py-3 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>ID</th>
                  <th className="px-4 py-3 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Nome</th>
                  <th className="px-4 py-3 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Email</th>
                  <th className="px-4 py-3 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>CPF</th>
                  <th className="px-4 py-3 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-b transition-colors hover:opacity-80" style={{ borderColor: 'var(--color-border)' }}>
                    <td className="px-4 py-3" style={{ color: 'var(--color-muted-foreground)' }}>{client.id}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--color-foreground)' }}>{client.name}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--color-muted-foreground)' }}>{client.email}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--color-muted-foreground)' }}>{client.cpf}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(client)}>Editar</Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(client.id)} className="text-red-500 hover:text-red-600">Remover</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal Criar/Editar */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClient ? 'Editar Cliente' : 'Novo Cliente'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Nome" value={formName} onChange={(e) => setFormName(e.target.value)} required autoFocus />
          <Input label="Email" type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} required />
          <Input label="CPF" value={formCpf} onChange={(e) => setFormCpf(e.target.value)} required placeholder="123.456.789-00" />

          {formError && (
            <div className="rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-destructive)' }}>
              {formError}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t pt-4" style={{ borderColor: 'var(--color-border)' }}>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit" isLoading={isSaving}>{editingClient ? 'Salvar' : 'Criar'}</Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  )
}

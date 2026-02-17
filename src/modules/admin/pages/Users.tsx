/**
 * @file src/modules/admin/pages/Users.tsx
 * 
 * Página de gerenciamento de usuários - API real
 */

import { useEffect, useState, useCallback, FormEvent } from 'react'
import { PageContainer } from '@shared/components/Layout/PageContainer'
import { Card } from '@shared/components/UI/Card'
import { Button } from '@shared/components/UI/Button'
import { Input } from '@shared/components/UI/Input'
import { Modal } from '@shared/components/UI/Modal'
import { listUsers, createUser, updateUser, deleteUser } from '@shared/services/userService'

interface ApiUser {
  id: number
  name: string
  email: string
}

export function UsersPage() {
  const [users, setUsers] = useState<ApiUser[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<ApiUser | null>(null)
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formPassword, setFormPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const loadUsers = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await listUsers()
      setUsers(data)
    } catch (err) {
      console.error('Erro ao carregar usuários:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const openCreate = () => {
    setEditingUser(null)
    setFormName('')
    setFormEmail('')
    setFormPassword('')
    setFormError(null)
    setIsModalOpen(true)
  }

  const openEdit = (user: ApiUser) => {
    setEditingUser(user)
    setFormName(user.name)
    setFormEmail(user.email)
    setFormPassword('')
    setFormError(null)
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!formName.trim() || !formEmail.trim()) {
      setFormError('Nome e email são obrigatórios')
      return
    }
    if (!editingUser && !formPassword) {
      setFormError('Senha é obrigatória para novo usuário')
      return
    }

    setIsSaving(true)
    try {
      if (editingUser) {
        const updateData: Record<string, string> = { name: formName, email: formEmail }
        if (formPassword) updateData.password = formPassword
        await updateUser(editingUser.id, updateData)
      } else {
        await createUser({ name: formName, email: formEmail, password: formPassword })
      }
      setIsModalOpen(false)
      await loadUsers()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message
      setFormError(Array.isArray(msg) ? msg.join(', ') : (msg as string) || 'Erro ao salvar usuário')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (user: ApiUser) => {
    if (!confirm(`Tem certeza que deseja remover "${user.name}"?`)) return
    try {
      await deleteUser(user.id)
      await loadUsers()
    } catch (err) {
      console.error('Erro ao remover usuário:', err)
    }
  }

  return (
    <PageContainer
      title="Usuários"
      description="Gerencie os usuários do sistema"
      action={
        <Button variant="primary" size="sm" onClick={openCreate}>
          + Novo Usuário
        </Button>
      }
    >
      <Card padding="sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[var(--color-primary)]" />
          </div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center">
            <p style={{ color: 'var(--color-muted-foreground)' }}>Nenhum usuário cadastrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left" style={{ borderColor: 'var(--color-border)' }}>
                  <th className="px-4 py-3 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Nome</th>
                  <th className="px-4 py-3 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Email</th>
                  <th className="px-4 py-3 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b transition-colors hover:opacity-80" style={{ borderColor: 'var(--color-border)' }}>
                    <td className="px-4 py-3" style={{ color: 'var(--color-foreground)' }}>
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: 'var(--color-primary)' }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        {user.name}
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--color-muted-foreground)' }}>
                      {user.email}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(user)}>Editar</Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(user)} className="text-red-500 hover:text-red-600">Remover</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? 'Editar Usuário' : 'Novo Usuário'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Nome" value={formName} onChange={(e) => setFormName(e.target.value)} required />
          <Input label="Email" type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} required />
          <Input label={editingUser ? 'Nova senha (opcional)' : 'Senha'} type="password" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} required={!editingUser} />

          {formError && (
            <div className="rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-destructive)' }}>
              {formError}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t pt-4" style={{ borderColor: 'var(--color-border)' }}>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit" isLoading={isSaving}>{editingUser ? 'Salvar' : 'Criar'}</Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  )
}

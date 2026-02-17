/**
 * @file src/modules/auth/pages/Login.tsx
 * 
 * Página de login com branding dinâmico do tenant
 * 
 * Design:
 * - Layout centrado, estilo SaaS moderno
 * - Mostra logo e nome do tenant (white-label)
 * - Redireciona para admin/client baseado no perfil
 */

import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@shared/hooks/useAuth'
import { useTenant } from '@shared/hooks/useTenant'
import { useTheme } from '@shared/hooks/useTheme'
import { Input } from '@shared/components/UI/Input'
import { Button } from '@shared/components/UI/Button'
import { isValidEmail } from '@shared/utils'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const { tenant, tenantId } = useTenant()
  const { isDarkMode, toggleDarkMode } = useTheme()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Se já autenticado, redireciona
  if (isAuthenticated) {
    navigate('/', { replace: true })
    return null
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!isValidEmail(email)) {
      setError('Email inválido')
      return
    }

    if (!password) {
      setError('Senha obrigatória')
      return
    }

    if (!tenantId) {
      setError('Tenant não identificado. Verifique a URL.')
      return
    }

    setIsLoading(true)

    try {
      await login(email, password, tenantId)
      navigate('/', { replace: true })
    } catch {
      setError('Credenciais inválidas. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ backgroundColor: 'var(--color-muted)' }}
    >
      {/* Dark mode toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed right-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg border transition-colors"
        style={{
          backgroundColor: 'var(--color-background)',
          borderColor: 'var(--color-border)',
        }}
        title={isDarkMode ? 'Modo claro' : 'Modo escuro'}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      <div
        className="w-full max-w-sm rounded-2xl border p-8 shadow-xl animate-slide-up"
        style={{
          backgroundColor: 'var(--color-background)',
          borderColor: 'var(--color-border)',
        }}
      >
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {tenant?.brand.name.charAt(0) || 'S'}
          </div>
          <div className="text-center">
            <h1
              className="text-xl font-bold"
              style={{ color: 'var(--color-foreground)' }}
            >
              {tenant?.brand.name || 'SaaS Platform'}
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
              Faça login para continuar
            </p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            autoComplete="email"
            autoFocus
          />

          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />

          {error && (
            <div
              className="rounded-lg px-3 py-2 text-sm"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: 'var(--color-destructive)',
              }}
            >
              {error}
            </div>
          )}

          <Button type="submit" fullWidth isLoading={isLoading}>
            Entrar
          </Button>
        </form>

        {/* Mock hint (apenas desenvolvimento) */}
        {import.meta.env.VITE_USE_MOCK === 'true' && (
          <div
            className="mt-6 rounded-lg p-3 text-xs"
            style={{
              backgroundColor: 'var(--color-muted)',
              color: 'var(--color-muted-foreground)',
            }}
          >
            <p className="font-medium mb-1">🧪 Mock Mode</p>
            <p>admin@acme.com / qualquer senha (admin)</p>
            <p>user@acme.com / qualquer senha (user)</p>
          </div>
        )}
      </div>
    </div>
  )
}

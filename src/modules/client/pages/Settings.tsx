/**
 * @file src/modules/client/pages/Settings.tsx
 */

import { PageContainer } from '@shared/components/Layout/PageContainer'
import { Card, CardHeader } from '@shared/components/UI/Card'
import { Button } from '@shared/components/UI/Button'
import { useTheme } from '@shared/hooks/useTheme'

export function ClientSettings() {
  const { isDarkMode, toggleDarkMode } = useTheme()
  const isDark = isDarkMode

  return (
    <PageContainer title="Configurações" description="Personalize sua experiência">
      <div className="max-w-2xl space-y-6">
        {/* Aparência */}
        <Card>
          <CardHeader title="Aparência" description="Ajuste o visual do aplicativo" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
                Modo Escuro
              </p>
              <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
                {isDark ? 'Tema escuro ativado' : 'Tema claro ativado'}
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={isDark}
              onClick={toggleDarkMode}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full
                transition-colors duration-200
                ${isDark ? 'bg-blue-600' : 'bg-gray-300'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white
                  transition-transform duration-200
                  ${isDark ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader title="Notificações" description="Gerencie suas preferências de notificação" />

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded accent-[var(--color-primary)]"
              />
              <span className="text-sm" style={{ color: 'var(--color-foreground)' }}>
                Notificações por e-mail
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded accent-[var(--color-primary)]"
              />
              <span className="text-sm" style={{ color: 'var(--color-foreground)' }}>
                Notificações push
              </span>
            </label>
          </div>
        </Card>

        {/* Sessão */}
        <Card>
          <CardHeader title="Sessão" description="Gerenciamento de sessão" />

          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              Limpar Cache
            </Button>
            <Button variant="destructive" size="sm">
              Encerrar Todas as Sessões
            </Button>
          </div>
        </Card>
      </div>
    </PageContainer>
  )
}

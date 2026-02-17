/**
 * @file src/shared/components/UI/Modal.tsx
 * 
 * Modal reutilizável com overlay e animação
 */

import { useEffect, useCallback, ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
  /** Se true, não permite fechar clicando no overlay */
  persistent?: boolean
}

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  persistent = false,
}: ModalProps) {
  // Fechar com ESC
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !persistent) {
        onClose()
      }
    },
    [onClose, persistent]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={persistent ? undefined : onClose}
      />

      {/* Modal content */}
      <div
        className={`relative ${sizeStyles[size]} w-full mx-4 rounded-xl shadow-2xl animate-slide-up`}
        style={{ backgroundColor: 'var(--color-background)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-6 py-4"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>
            {title}
          </h2>
          {!persistent && (
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:opacity-70"
              style={{ color: 'var(--color-muted-foreground)' }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  )
}

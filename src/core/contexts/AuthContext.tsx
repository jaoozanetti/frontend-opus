/**
 * @file src/core/contexts/AuthContext.tsx
 * 
 * Contexto global de autenticação
 * 
 * Decisão de design:
 * - Access Token armazenado APENAS em memória (useState)
 * - Refresh Token gerenciado via cookie httpOnly (pelo backend)
 * - Permissões dinâmicas (RBAC) baseadas no profile do usuário
 * - Interceptores configurados após login para injetar token
 * - Logout automático se refresh falhar
 * 
 * Segurança:
 * - Access Token NUNCA persiste em localStorage/sessionStorage
 * - Ao recarregar a página, tenta refresh automático
 * - Se refresh falhar, redireciona para login
 */

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react'
import {
  AuthContextType,
  AuthUser,
  Permission,
  LoginResponse,
  ApiResponse,
  RefreshTokenResponse,
} from '@shared/types'
import { getApiClient } from '@core/adapters'
import { endpoints } from '@core/api'
import { devLog, devError } from '@core/config'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
  tenantId: string | null
}

export function AuthProvider({ children, tenantId }: AuthProviderProps) {
  // Access Token em MEMÓRIA apenas (segurança)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isAuthenticated = !!user && !!accessToken

  /**
   * Login: autentica e armazena token em memória
   */
  const login = useCallback(async (email: string, password: string, loginTenantId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const apiClient = getApiClient()
      const response = await apiClient.post<ApiResponse<LoginResponse>>(
        endpoints.auth.login(),
        { email, password, tenantId: loginTenantId }
      )

      const { user: loggedUser, accessToken: token } = response.data
      // refreshToken é gerenciado pelo cookie httpOnly (set-cookie header do backend)

      setUser(loggedUser)
      setAccessToken(token)
      setPermissions(loggedUser.profile.permissions)

      devLog('Login realizado:', loggedUser.email)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao realizar login'
      setError(errorMessage)
      devError('Erro no login', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Logout: limpa tudo da memória
   */
  const logout = useCallback(() => {
    devLog('Logout realizado')
    setUser(null)
    setAccessToken(null)
    setPermissions([])
    setError(null)

    // Tenta avisar backend (best effort)
    try {
      const apiClient = getApiClient()
      apiClient.post(endpoints.auth.logout()).catch(() => {
        // Ignora erro no logout - já limpou local
      })
    } catch {
      // Ignora
    }
  }, [])

  /**
   * Refresh Access Token via cookie httpOnly
   * Chamado automaticamente pelo interceptor de auth
   */
  const refreshAccessToken = useCallback(async () => {
    try {
      const apiClient = getApiClient()
      const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>(
        endpoints.auth.refresh()
      )

      const { accessToken: newToken } = response.data
      setAccessToken(newToken)
      devLog('Access token renovado com sucesso')
    } catch (err) {
      devError('Falha ao renovar access token', err)
      logout()
      throw err
    }
  }, [logout])

  /**
   * Verifica se usuário tem uma permissão específica
   */
  const hasPermission = useCallback((permissionCode: string): boolean => {
    return permissions.some((p) => p.code === permissionCode)
  }, [permissions])

  /**
   * Verifica se usuário tem QUALQUER uma das permissões
   */
  const hasAnyPermission = useCallback((permissionCodes: string[]): boolean => {
    return permissionCodes.some((code) => permissions.some((p) => p.code === code))
  }, [permissions])

  /**
   * Verifica se usuário tem TODAS as permissões
   */
  const hasAllPermissions = useCallback((permissionCodes: string[]): boolean => {
    return permissionCodes.every((code) => permissions.some((p) => p.code === code))
  }, [permissions])

  /**
   * Ao montar, tenta recuperar sessão com refresh token (cookie httpOnly)
   * Isso permite manter sessão ao recarregar a página
   */
  useEffect(() => {
    if (!tenantId) {
      setIsLoading(false)
      return
    }

    const tryRecoverSession = async () => {
      try {
        await refreshAccessToken()

        // Se refresh funcionou, carrega dados do usuário
        const apiClient = getApiClient()
        const response = await apiClient.get<ApiResponse<{ user: AuthUser }>>(
          endpoints.auth.me()
        )

        const recoveredUser = response.data.user
        setUser(recoveredUser)
        setPermissions(recoveredUser.profile.permissions)
        devLog('Sessão recuperada:', recoveredUser.email)
      } catch {
        // Sem sessão ativa, normal para primeiro acesso
        devLog('Nenhuma sessão ativa encontrada')
      } finally {
        setIsLoading(false)
      }
    }

    tryRecoverSession()
  }, [tenantId, refreshAccessToken])

  const contextValue = useMemo<AuthContextType>(() => ({
    user,
    permissions,
    accessToken,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    refreshAccessToken,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  }), [
    user, permissions, accessToken, isAuthenticated,
    isLoading, error, login, logout, refreshAccessToken,
    hasPermission, hasAnyPermission, hasAllPermissions,
  ])

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }

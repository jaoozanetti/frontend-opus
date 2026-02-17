/**
 * @file src/core/contexts/AuthContext.tsx
 * 
 * Contexto global de autenticação integrado com api-vendas
 * 
 * Fluxo de login:
 * 1. POST /api/auth/login com { email, password }
 * 2. Recebe { access_token, refresh_token }
 * 3. Decodifica JWT para obter userId
 * 4. GET /api/users/{userId} para dados do usuário
 * 5. Armazena tokens + user no state
 * 
 * Fluxo de refresh:
 * 1. POST /api/auth/refresh com { refresh_token }
 * 2. Recebe novo par { access_token, refresh_token }
 * 
 * Persistência:
 * - access_token: memória (tokenStore)
 * - refresh_token: localStorage (tokenStore)
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
  UserProfile,
} from '@shared/types'
import {
  axiosInstance,
  endpoints,
  getAccessToken,
  setAccessToken,
  getRefreshToken,
  setRefreshToken,
  clearTokens,
  decodeJwtPayload,
} from '@core/api'
import { devLog, devError } from '@core/config'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
  tenantId: string | null
}

/** Perfil admin padrão (API não possui RBAC) */
const defaultPermissions: Permission[] = [
  { id: '1', code: 'users.view', module: 'users', action: 'read', description: 'Ver usuários', createdAt: '' },
  { id: '2', code: 'users.create', module: 'users', action: 'create', description: 'Criar usuários', createdAt: '' },
  { id: '3', code: 'users.update', module: 'users', action: 'update', description: 'Editar usuários', createdAt: '' },
  { id: '4', code: 'users.delete', module: 'users', action: 'delete', description: 'Excluir usuários', createdAt: '' },
  { id: '5', code: 'tenants.view', module: 'tenants', action: 'read', description: 'Ver tenants', createdAt: '' },
  { id: '6', code: 'audit.view', module: 'audit', action: 'read', description: 'Ver auditoria', createdAt: '' },
  { id: '7', code: 'profiles.view', module: 'profiles', action: 'read', description: 'Ver perfis', createdAt: '' },
  { id: '8', code: 'clients.view', module: 'clients', action: 'read', description: 'Ver clientes', createdAt: '' },
  { id: '9', code: 'clients.create', module: 'clients', action: 'create', description: 'Criar clientes', createdAt: '' },
  { id: '10', code: 'clients.update', module: 'clients', action: 'update', description: 'Editar clientes', createdAt: '' },
  { id: '11', code: 'clients.delete', module: 'clients', action: 'delete', description: 'Excluir clientes', createdAt: '' },
  { id: '12', code: 'products.view', module: 'products', action: 'read', description: 'Ver produtos', createdAt: '' },
  { id: '13', code: 'products.create', module: 'products', action: 'create', description: 'Criar produtos', createdAt: '' },
  { id: '14', code: 'products.update', module: 'products', action: 'update', description: 'Editar produtos', createdAt: '' },
  { id: '15', code: 'products.delete', module: 'products', action: 'delete', description: 'Excluir produtos', createdAt: '' },
  { id: '16', code: 'sales.view', module: 'sales', action: 'read', description: 'Ver vendas', createdAt: '' },
  { id: '17', code: 'sales.create', module: 'sales', action: 'create', description: 'Criar vendas', createdAt: '' },
  { id: '18', code: 'sales.delete', module: 'sales', action: 'delete', description: 'Excluir vendas', createdAt: '' },
]

const defaultProfile: UserProfile = {
  id: 'profile-admin',
  name: 'Administrador',
  description: 'Acesso total ao sistema',
  permissions: defaultPermissions,
  createdAt: '',
  updatedAt: '',
}

/** Converte usuário da API para AuthUser do frontend */
function apiUserToAuthUser(apiUser: { id: number; name: string; email: string }): AuthUser {
  return {
    id: String(apiUser.id),
    email: apiUser.email,
    name: apiUser.name,
    tenantId: 'default',
    profileId: 'profile-admin',
    profile: defaultProfile,
    lastLoginAt: new Date().toISOString(),
    createdAt: '',
  }
}

export function AuthProvider({ children, tenantId }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [accessTokenState, setAccessTokenState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isAuthenticated = !!user && !!accessTokenState

  /**
   * Busca dados do usuário pelo ID usando o token atual
   */
  const fetchUserById = useCallback(async (userId: number, token: string): Promise<AuthUser> => {
    const response = await axiosInstance.get(`${endpoints.users.detail(String(userId))}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return apiUserToAuthUser(response.data)
  }, [])

  /**
   * Login: autentica com email/password e carrega dados do usuário
   */
  const login = useCallback(async (email: string, password: string, _loginTenantId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // 1. Autentica na API
      const loginResponse = await axiosInstance.post(endpoints.auth.login(), { email, password })
      const { access_token, refresh_token } = loginResponse.data

      // 2. Armazena tokens
      setAccessToken(access_token)
      setRefreshToken(refresh_token)
      setAccessTokenState(access_token)

      // 3. Decodifica JWT para obter userId
      const payload = decodeJwtPayload(access_token)
      const userId = payload?.sub as number

      if (!userId) {
        throw new Error('Token JWT inválido: userId não encontrado')
      }

      // 4. Busca dados do usuário
      const authUser = await fetchUserById(userId, access_token)
      setUser(authUser)
      setPermissions(defaultPermissions)

      devLog('Login realizado:', email)
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Credenciais inválidas'
      setError(errorMessage)
      devError('Erro no login', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [fetchUserById])

  /**
   * Logout: limpa tokens e estado
   */
  const logout = useCallback(() => {
    devLog('Logout realizado')

    // Tenta avisar backend (best effort)
    const token = getAccessToken()
    const refreshTk = getRefreshToken()
    if (token) {
      axiosInstance.post(endpoints.auth.logout(), { refresh_token: refreshTk }, {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => { /* ignora */ })
    }

    clearTokens()
    setUser(null)
    setAccessTokenState(null)
    setPermissions([])
    setError(null)
  }, [])

  /**
   * Refresh Access Token usando refresh_token armazenado
   */
  const refreshAccessToken = useCallback(async () => {
    const refreshTk = getRefreshToken()
    if (!refreshTk) {
      throw new Error('Sem refresh token')
    }

    try {
      const response = await axiosInstance.post(endpoints.auth.refresh(), {
        refresh_token: refreshTk,
      })

      const { access_token, refresh_token } = response.data
      setAccessToken(access_token)
      setRefreshToken(refresh_token)
      setAccessTokenState(access_token)

      devLog('Access token renovado com sucesso')
      return access_token
    } catch (err) {
      devError('Falha ao renovar access token', err)
      clearTokens()
      setUser(null)
      setAccessTokenState(null)
      setPermissions([])
      throw err
    }
  }, [])

  /**
   * Checks de permissão (sempre true pois API não tem RBAC)
   */
  const hasPermission = useCallback((permissionCode: string): boolean => {
    return permissions.some((p) => p.code === permissionCode)
  }, [permissions])

  const hasAnyPermission = useCallback((permissionCodes: string[]): boolean => {
    return permissionCodes.some((code) => permissions.some((p) => p.code === code))
  }, [permissions])

  const hasAllPermissions = useCallback((permissionCodes: string[]): boolean => {
    return permissionCodes.every((code) => permissions.some((p) => p.code === code))
  }, [permissions])

  /**
   * Ao montar, tenta recuperar sessão via refresh token
   */
  useEffect(() => {
    const tryRecoverSession = async () => {
      const refreshTk = getRefreshToken()
      if (!refreshTk) {
        devLog('Nenhuma sessão ativa encontrada')
        setIsLoading(false)
        return
      }

      try {
        // Tenta renovar o token
        const response = await axiosInstance.post(endpoints.auth.refresh(), {
          refresh_token: refreshTk,
        })

        const { access_token, refresh_token } = response.data
        setAccessToken(access_token)
        setRefreshToken(refresh_token)
        setAccessTokenState(access_token)

        // Decodifica JWT para obter userId
        const payload = decodeJwtPayload(access_token)
        const userId = payload?.sub as number

        if (userId) {
          const authUser = await fetchUserById(userId, access_token)
          setUser(authUser)
          setPermissions(defaultPermissions)
          devLog('Sessão recuperada:', authUser.email)
        }
      } catch {
        devLog('Sessão expirada, limpando tokens')
        clearTokens()
      } finally {
        setIsLoading(false)
      }
    }

    tryRecoverSession()
  }, [tenantId, fetchUserById])

  const contextValue = useMemo<AuthContextType>(() => ({
    user,
    permissions,
    accessToken: accessTokenState,
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
    user, permissions, accessTokenState, isAuthenticated,
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

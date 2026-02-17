/**
 * @file src/core/config/constants.ts
 * 
 * Constantes da aplicação
 */

/** Endpoints da API */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  USERS: {
    LIST: '/users',
    DETAIL: '/users/:userId',
    CREATE: '/users',
    UPDATE: '/users/:userId',
    DELETE: '/users/:userId',
  },
  CLIENTS: {
    LIST: '/clients',
    DETAIL: '/clients/:clientId',
    CREATE: '/clients',
    UPDATE: '/clients/:clientId',
    DELETE: '/clients/:clientId',
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: '/products/:productId',
    CREATE: '/products',
    UPDATE: '/products/:productId',
    DELETE: '/products/:productId',
  },
  SALES: {
    LIST: '/sales',
    DETAIL: '/sales/:saleId',
    CREATE: '/sales',
    UPDATE: '/sales/:saleId',
    DELETE: '/sales/:saleId',
  },
  TENANTS: {
    CONFIG: '/tenants/:tenantId/config',
  },
  AUDIT: {
    LIST: '/audit-logs',
    CREATE: '/audit-logs',
  },
  PROFILES: {
    LIST: '/profiles',
    DETAIL: '/profiles/:profileId',
  },
  PERMISSIONS: {
    LIST: '/permissions',
  },
} as const

/** Permissões da aplicação */
export const PERMISSIONS = {
  // Users
  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_UPDATE: 'users.update',
  USERS_DELETE: 'users.delete',

  // Tenants
  TENANTS_VIEW: 'tenants.view',
  TENANTS_CREATE: 'tenants.create',
  TENANTS_UPDATE: 'tenants.update',
  TENANTS_DELETE: 'tenants.delete',

  // Audit
  AUDIT_VIEW: 'audit.view',
  AUDIT_EXPORT: 'audit.export',

  // Profiles
  PROFILES_VIEW: 'profiles.view',
  PROFILES_MANAGE: 'profiles.manage',
} as const

/** Timeouts (ms) */
export const TIMEOUTS = {
  API_REQUEST: 10000,
  TOKEN_REFRESH: 5000,
  MODAL_ANIMATION: 300,
} as const

/** Keys para localStorage */
export const STORAGE_KEYS = {
  THEME_PREFERENCE: 'app.theme.darkMode',
  TENANT_ID: 'app.tenant.id',
  RECENT_TENANT: 'app.tenant.recent',
} as const

/** Regex patterns */
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
} as const

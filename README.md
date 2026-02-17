# 🏢 SaaS Multi-Tenant Frontend Platform

Plataforma frontend SaaS multi-tenant construída com React, TypeScript, Vite e TailwindCSS. Arquitetura modular com suporte a white-label, RBAC dinâmico, auditoria, mock system e deploy Docker.

---

## 📋 Índice

- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Início Rápido](#-início-rápido)
- [Multi-Tenancy](#-multi-tenancy)
- [Autenticação & RBAC](#-autenticação--rbac)
- [Sistema de Auditoria](#-sistema-de-auditoria)
- [White-Label & Temas](#-white-label--temas)
- [Mock System](#-mock-system)
- [Guia de Integração API](#-guia-de-integração-api)
- [Docker](#-docker)
- [Docker Hub](#-docker-hub)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Scripts Disponíveis](#-scripts-disponíveis)

---

## 🛠 Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 18.2 | UI declarativa com componentes funcionais |
| TypeScript | 5.3 | Tipagem estática (strict mode) |
| Vite | 5.x | Bundler com HMR e code splitting |
| TailwindCSS | 3.4 | Utility-first CSS com dark mode |
| Axios | 1.6 | HTTP client com interceptors |
| React Router DOM | 6.20 | Roteamento SPA com guards RBAC |
| DOMPurify | 3.0 | Sanitização XSS |

---

## 🏗 Arquitetura

### Camadas

```
┌───────────────────────────────────────────┐
│              Modules Layer                │
│  (admin, client, auth - pages/components) │
├───────────────────────────────────────────┤
│              Shared Layer                 │
│  (hooks, types, services, utils, UI)      │
├───────────────────────────────────────────┤
│               Core Layer                  │
│  (config, api, adapters, mocks, contexts) │
└───────────────────────────────────────────┘
```

### Design Patterns

- **Adapter Pattern** — `IApiClient` → `RealApiClient` / `MockApiClient`
- **Factory Pattern** — `ApiClientFactory` (singleton, controlado por env)
- **Context API** — Estado global sem Redux (Tenant, Auth, Theme)
- **SOLID** — Single Responsibility, Interface Segregation aplicados em todos os módulos

### Fluxo de Inicialização

```
1. main.tsx → configura interceptors
2. App.tsx → TenantProvider (resolve tenant via subdomínio)
3.        → ThemeProvider (aplica brand + dark mode)
4.        → AuthProvider (recupera sessão via refresh token)
5.        → AppRoutes (renderiza rotas protegidas)
```

---

## 📁 Estrutura de Pastas

```
src/
├── core/                      # Camada Core
│   ├── config/                # Configurações e env
│   │   ├── env.ts             # Validação de variáveis de ambiente
│   │   └── constants.ts       # Endpoints, permissões, timeouts
│   ├── api/                   # Cliente HTTP
│   │   ├── axiosInstance.ts    # Instância Axios configurada
│   │   ├── endpoints.ts       # URL builder com path params
│   │   └── interceptors/      # Auth, Error, Logger
│   ├── adapters/              # Adapter Pattern
│   │   ├── RealApiClient.ts   # Implementação Axios
│   │   ├── MockApiClient.ts   # Implementação Mock
│   │   └── ApiClientFactory.ts# Singleton factory
│   ├── mocks/                 # Dados e handlers mock
│   │   ├── data/              # Tenants, users, permissions
│   │   └── handlers/          # Auth, tenant, user, audit
│   └── contexts/              # React Contexts
│       ├── TenantContext.tsx   # Detecção de subdomínio
│       ├── AuthContext.tsx     # Tokens em memória + RBAC
│       └── ThemeContext.tsx    # CSS variables + dark mode
├── shared/                    # Camada Shared
│   ├── types/                 # TypeScript types
│   ├── hooks/                 # Custom hooks
│   ├── services/              # Audit, sanitizer
│   ├── utils/                 # Validators, formatters
│   ├── styles/                # globals.css (Tailwind + vars)
│   └── components/            # Componentes reutilizáveis
│       ├── UI/                # Button, Input, Modal, Card, Badge, Spinner
│       ├── Modals/            # AuditModal, ConfirmModal
│       └── Layout/            # PageContainer, Sidebar, Header, BottomNav
├── modules/                   # Camada Modules
│   ├── admin/                 # Painel administrativo
│   │   ├── components/        # AdminLayout
│   │   └── pages/             # Dashboard, Users, Audit, Settings
│   ├── auth/                  # Autenticação
│   │   └── pages/             # Login
│   └── client/                # Portal do cliente
│       ├── components/        # ClientLayout
│       └── pages/             # Home, Dashboard, Profile, Settings
├── routes/                    # Configuração de rotas
│   ├── RouteConfig.ts         # Definições com permissões
│   ├── ProtectedRoute.tsx     # Guard RBAC
│   └── Routes.tsx             # Todas as rotas da aplicação
├── App.tsx                    # Provider hierarchy
├── main.tsx                   # Entry point
└── vite-env.d.ts              # Vite type declarations
```

---

## 🚀 Início Rápido

### Pré-requisitos

- Node.js ≥ 18
- npm ≥ 9

### Instalação

```bash
# Clonar repositório
git clone <repo-url>
cd frontend-opus

# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env.development

# Iniciar em modo desenvolvimento (com mocks)
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

### Credenciais Mock

| Usuário | Senha | Perfil |
|---|---|---|
| admin@acme.com | admin123 | Administrador (todas as permissões) |
| user@acme.com | user123 | Usuário (permissões limitadas) |

---

## 🏘 Multi-Tenancy

### Como Funciona

1. **Detecção do Tenant** — Extrai subdomínio da URL:
   - `acme.app.com` → tenant `acme`
   - `beta.app.com` → tenant `beta`
   - `localhost` → fallback para tenant `acme` (dev)

2. **Configuração do Tenant** — API retorna brand config:
   ```json
   {
     "id": "tenant-1",
     "slug": "acme",
     "name": "ACME Corp",
     "brand": {
       "primaryColor": "#2563EB",
       "secondaryColor": "#7C3AED",
       "logoUrl": "/logos/acme.svg"
     }
   }
   ```

3. **Injeção de Header** — Toda requisição inclui:
   ```
   X-Tenant-ID: acme
   ```

### Adicionar Novo Tenant (Mock)

Editar `src/core/mocks/data/tenants.ts` e adicionar novo objeto ao array `mockTenants`.

---

## 🔐 Autenticação & RBAC

### Fluxo de Autenticação

```
Login → Access Token (memória) + Refresh Token (httpOnly cookie)
     → Interceptor injeta Authorization: Bearer <token>
     → 401 → Tenta refresh automático
     → Refresh falha → Logout + redirect /login
```

### RBAC Dinâmico

Permissões baseadas em módulo + ação:

```typescript
// Formato: modulo.acao
type Permission = {
  id: string
  module: string    // 'users' | 'tenants' | 'audit' | 'settings'
  action: string    // 'view' | 'create' | 'edit' | 'delete'
}
```

### Uso em Componentes

```tsx
import { usePermission } from '@shared/hooks'

function AdminPage() {
  const canCreate = usePermission('users', 'create')
  const canDelete = usePermission('users', 'delete')

  return (
    <div>
      {canCreate && <Button>Novo Usuário</Button>}
      {canDelete && <Button variant="destructive">Excluir</Button>}
    </div>
  )
}
```

### Rotas Protegidas

```tsx
// RouteConfig.ts
{
  path: '/admin/users',
  requiredPermissions: [
    { module: 'users', action: 'view' }
  ]
}
```

---

## 📊 Sistema de Auditoria

### Operações Auditadas

Apenas operações críticas de CRUD:

| Ação | Descrição |
|---|---|
| `CREATE` | Criação de registros |
| `UPDATE` | Atualização de registros |
| `DELETE` | Exclusão permanente |
| `INACTIVE` | Inativação (soft delete) |

### AuditModal

Modal obrigatório que coleta justificativa (mínimo 10 caracteres) antes de executar a operação:

```tsx
import { useAuditAction } from '@shared/components/Modals'

function UsersPage() {
  const { executeAction, AuditModalComponent } = useAuditAction()

  const handleDelete = (userId: string) => {
    executeAction({
      action: AuditAction.DELETE,
      entity: 'user',
      entityId: userId,
      description: `Excluir usuário ${userId}`,
      apiCall: () => apiClient.delete(`/users/${userId}`)
    })
  }

  return (
    <>
      <Button onClick={() => handleDelete('123')}>Excluir</Button>
      <AuditModalComponent />
    </>
  )
}
```

### executeWithAudit

Para uso programático sem modal:

```tsx
import { executeWithAudit } from '@shared/services'

await executeWithAudit(
  {
    action: AuditAction.UPDATE,
    entity: 'settings',
    entityId: 'config-1',
    description: 'Atualizar configurações',
    justification: 'Correção de timezone'
  },
  () => apiClient.put('/settings', data)
)
```

---

## 🎨 White-Label & Temas

### CSS Variables

O tema é aplicado via CSS variables no `:root`:

```css
:root {
  --color-primary: #2563EB;
  --color-secondary: #7C3AED;
  --color-background: #FFFFFF;
  --color-foreground: #1A1A2E;
  --color-muted: #6B7280;
  --color-border: #E5E7EB;
}
```

### Dark Mode

- Alternado via `toggleDarkMode()` do `useTheme()`
- Preferência salva em `localStorage`
- Classe `dark` aplicada no `<html>`

### Aplicar Brand do Tenant

O `ThemeProvider` aplica automaticamente as cores do tenant via `applyBrandTheme()` quando o `TenantContext` carrega a configuração.

### Customizar Componentes

Todos os componentes UI usam CSS variables:

```tsx
<div style={{ color: 'var(--color-primary)' }}>
  Texto na cor primária do tenant
</div>
```

---

## 🔌 Mock System

### Adapter Pattern

```
IApiClient (interface)
├── RealApiClient  → Axios → API real
└── MockApiClient  → Handlers → Dados locais
```

### Ativar/Desativar

```env
# .env.development
VITE_USE_MOCK=true   # Usar mocks
VITE_USE_MOCK=false  # Usar API real
```

O `ApiClientFactory` seleciona automaticamente a implementação baseado nesta variável. A troca é **transparente** — nenhum componente ou serviço precisa mudar.

### Adicionar Novo Mock Handler

1. Criar handler em `src/core/mocks/handlers/`:

```typescript
// myHandler.ts
import type { MockHandler } from '@shared/types/api'

export const myHandlers: MockHandler[] = [
  {
    method: 'GET',
    url: '/api/my-resource',
    handler: async () => ({
      data: { items: [...] },
      status: 200
    })
  }
]
```

2. Registrar em `src/core/mocks/handlers/index.ts`:

```typescript
import { myHandlers } from './myHandler'
export const allHandlers = [
  ...authHandlers,
  ...myHandlers  // Adicionar aqui
]
```

---

## 🔄 Guia de Integração API

### Substituir Mocks por API Real

1. **Definir `VITE_USE_MOCK=false`** no `.env`
2. **Configurar `VITE_API_BASE_URL`** para a URL do backend
3. **Verificar endpoints** em `src/core/config/constants.ts`:

```typescript
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',       // POST { email, password }
    logout: '/auth/logout',     // POST
    refresh: '/auth/refresh',   // POST (cookie httpOnly)
    me: '/auth/me',             // GET → AuthUser
  },
  users: {
    list: '/users',             // GET → PaginatedResponse<User>
    byId: '/users/:id',        // GET → User
    create: '/users',           // POST → User
    update: '/users/:id',      // PUT → User
    delete: '/users/:id',      // DELETE
  },
  // ...
}
```

### Contratos Esperados

**Response padrão:**
```json
{
  "data": { ... },
  "message": "Operação realizada com sucesso",
  "success": true
}
```

**Response paginada:**
```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "perPage": 10,
    "total": 100,
    "totalPages": 10
  },
  "success": true
}
```

**Header obrigatório:** `X-Tenant-ID: <slug>` (injetado automaticamente)

**Autenticação:** `Authorization: Bearer <access_token>` (injetado automaticamente)

---

## 🐳 Docker

### Build Local

```bash
# Build da imagem
docker build -t saas-frontend .

# Executar container
docker run -p 3000:80 saas-frontend
```

### Docker Compose

```bash
# Build e executar
docker-compose up -d

# Com variáveis customizadas
VITE_API_BASE_URL=https://api.production.com docker-compose up -d --build

# Parar
docker-compose down
```

### Configuração Nginx

O container usa Nginx Alpine com:
- Gzip compression (CSS, JS, SVG, JSON)
- Headers de segurança (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection)
- Cache de assets estáticos (1 ano, immutable)
- SPA fallback (`try_files $uri /index.html`)
- Healthcheck endpoint (`/health`)

---

## 🚢 Docker Hub

### Publicar Imagem

```bash
# Login no Docker Hub
docker login

# Build com tag
docker build -t <seu-usuario>/saas-frontend:latest .
docker build -t <seu-usuario>/saas-frontend:1.0.0 .

# Push
docker push <seu-usuario>/saas-frontend:latest
docker push <seu-usuario>/saas-frontend:1.0.0
```

### Usar Imagem do Registry

```bash
docker pull <seu-usuario>/saas-frontend:latest
docker run -p 3000:80 <seu-usuario>/saas-frontend:latest
```

### CI/CD (exemplo GitHub Actions)

```yaml
- name: Build and push
  uses: docker/build-push-action@v5
  with:
    push: true
    tags: user/saas-frontend:${{ github.sha }}
    build-args: |
      VITE_API_BASE_URL=${{ secrets.API_URL }}
      VITE_USE_MOCK=false
```

---

## ⚙ Variáveis de Ambiente

| Variável | Obrigatória | Default | Descrição |
|---|---|---|---|
| `VITE_API_BASE_URL` | Sim | — | URL base da API backend |
| `VITE_USE_MOCK` | Sim | `true` | Usar mock system (`true`/`false`) |

**Importante:** Variáveis são injetadas em build-time pelo Vite. Para mudar valores, é necessário rebuild.

---

## 📜 Scripts Disponíveis

```bash
npm run dev       # Servidor de desenvolvimento (porta 3000)
npm run build     # Build de produção (tsc + vite build)
npm run preview   # Preview do build de produção
npm run lint      # Lint com ESLint (se configurado)
```

---

## 📐 Decisões Técnicas

| Decisão | Motivo |
|---|---|
| Access Token em memória | Previne XSS (não acessível via JS em storage) |
| Refresh Token via httpOnly cookie | Previne roubo de token |
| Context API (sem Redux) | Menor complexidade para escopo do projeto |
| Adapter Pattern para API | Troca transparente entre mock e API real |
| CSS Variables para white-label | Cada tenant aplica cores sem rebuild |
| `executeWithAudit` wrapper | Garante auditoria antes de operações críticas |
| esbuild como minifier | Incluído no Vite, sem dependência extra |
| Nginx Alpine em produção | Imagem leve (~25MB), headers de segurança |

---

## 📄 Licença

Proprietário — Todos os direitos reservados.

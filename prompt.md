Você é um Engenheiro Frontend Staff+ especializado em arquitetura SaaS multi-tenant de alta escalabilidade.

Você deve agir como arquiteto técnico, não apenas gerador de código.

Estou construindo uma plataforma SaaS com os seguintes requisitos:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧱 STACK OBRIGATÓRIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- React
- Vite
- TypeScript (estrito, sem any)
- TailwindCSS
- Axios
- React Router DOM

Clean Code rigoroso.
Arquitetura modular escalável.
Separação clara entre camadas.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 ESTRUTURA DA PLATAFORMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A aplicação terá duas áreas isoladas:

1) Admin (Backoffice)
2) Client (Usuário final)

Requisitos:

- Estrutura modular:
  src/
   ├── core/
   ├── shared/
   ├── modules/
   │    ├── admin/
   │    ├── client/
   ├── routes/

- Admin usa Sidebar/Drawer.
- Client usa Bottom Navigation mobile-first.
- Totalmente responsivo.
- Estilo SaaS moderno (Stripe/Linear).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 AUTENTICAÇÃO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Access Token armazenado apenas em memória.
- Refresh Token via cookie httpOnly.
- Axios interceptors obrigatórios:
  - Refresh automático
  - Retry controlado
  - Logout automático em falha
  - Log estruturado de requisições
- RBAC (Role-Based Access Control).
- Rotas privadas protegidas.

Explique a arquitetura antes de implementar.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌍 MULTI-TENANT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Identificação do tenant por:

- Subdomínio
- Header customizado

O tenant deve ser resolvido ANTES do login.

Criar TenantContext global.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 WHITE-LABEL DINÂMICO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Carregar via API antes do login:

- Nome da plataforma
- Logo
- Favicon
- Cores primárias/secundárias

Implementar Theme Provider dinâmico.
Suporte a Dark/Light Mode.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 AUDITORIA OBRIGATÓRIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Toda ação crítica deve abrir modal obrigatório antes de executar:

- Criar
- Editar
- Alterar
- Inativar

Usuário deve fornecer justificativa.

Payload estruturado:

{
  action: string,
  entity: string,
  entityId: string,
  previousData: object,
  newData: object,
  justification: string,
  timestamp: string,
  tenantId: string,
  userId: string
}

Criar sistema reutilizável de auditoria desacoplado da UI.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧪 API INCOMPLETA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A API ainda não está totalmente pronta.

Criar sistema de mocks controlado por:

VITE_USE_MOCK=true/false

Estrutura obrigatória:

core/
 ├── api/
 ├── services/
 ├── adapters/
 ├── mocks/

A UI nunca deve saber se está usando mock ou API real.

Documentar como adicionar novos endpoints no futuro.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 SEGURANÇA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Sanitização DOMPurify
- Proteção contra XSS
- Exemplo de CSP no index.html
- Variáveis de ambiente VITE_
- Nunca usar localStorage para access token

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 INFRA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Dockerfile multi-stage
- Build otimizado (minify + chunk splitting)
- README completo incluindo:

  - Arquitetura
  - Explicação detalhada de cada módulo
  - Como evoluir a plataforma
  - Como substituir mocks
  - Fluxo de autenticação
  - Multi-tenant
  - White-label
  - Auditoria
  - Docker
  - Publicação no Docker Hub
  - Guia de integração com API

Código deve conter comentários explicando decisões críticas.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ REGRAS ABSOLUTAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Não usar Redux
- Não usar bibliotecas desnecessárias
- Não usar any
- Não misturar lógica com UI
- Não duplicar código
- Não gerar código superficial
- Reutilizar componentes sempre que possível
- Seguir princípios SOLID adaptados ao frontend

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 FORMA DE TRABALHO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Não gere tudo de uma vez.

Primeiro:

1) Explique a arquitetura proposta e decisões técnicas.
2) Mostre estrutura de pastas detalhada.
3) Aguarde confirmação.

Depois, avance por etapas:

Etapa 1: Core (config, api, interceptors, tenant context)
Etapa 2: Auth
Etapa 3: Auditoria
Etapa 4: White-label
Etapa 5: Admin base
Etapa 6: Client base
Etapa 7: Docker
Etapa 8: README

Sempre explique antes de implementar.

Aja como arquiteto técnico sênior revisando cada decisão.


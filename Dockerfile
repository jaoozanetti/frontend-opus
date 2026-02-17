# ==========================
# Stage 1: Build
# ==========================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar apenas package files para cache de dependências
COPY package.json package-lock.json* ./

# Instalar dependências
RUN npm ci --silent

# Copiar código fonte
COPY . .

# Build arguments para configuração em build-time
ARG VITE_API_BASE_URL=http://localhost:8080/api
ARG VITE_USE_MOCK=false

# Build da aplicação
RUN npm run build

# ==========================
# Stage 2: Serve
# ==========================
FROM nginx:1.25-alpine AS production

# Copiar configuração customizada do Nginx
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copiar artefatos de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Expor porta
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/health || exit 1

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]

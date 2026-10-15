# Multi-stage build pour Fastify SSO Alphabette
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build || true

# Image de production minimale et sécurisée
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -g 1001 -S nodejs && adduser -S nodeuser -u 1001

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app ./

USER nodeuser
EXPOSE 4000

CMD ["npx", "tsx", "server.ts"]

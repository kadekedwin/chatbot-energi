# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app

# Install OpenSSL (required by Prisma)
RUN apk add --no-cache openssl libc6-compat

# Copy package files
COPY package*.json ./

# Copy Prisma schema (needed for postinstall script)
COPY prisma ./prisma

# Install dependencies
RUN npm install --omit=dev

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Install OpenSSL
RUN apk add --no-cache openssl libc6-compat

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app

# Install OpenSSL (runtime requirement)
RUN apk add --no-cache openssl libc6-compat

ENV NODE_ENV production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy necessary files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/*.js ./
COPY --from=builder /app/config ./config
COPY --from=builder /app/controllers ./controllers
COPY --from=builder /app/middleware ./middleware
COPY --from=builder /app/routes ./routes
COPY --from=builder /app/utils ./utils

# Create logs directory
RUN mkdir -p logs && chown -R nodejs:nodejs logs

USER nodejs

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "server.js"]

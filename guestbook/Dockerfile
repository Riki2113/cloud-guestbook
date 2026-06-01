# ── Stage 1: Install dependencies ─────────────────────────
FROM node:18-alpine AS deps

WORKDIR /app

# Copy package files dulu (memanfaatkan Docker layer cache)
COPY package*.json ./
RUN npm ci --only=production

# ── Stage 2: Production image ──────────────────────────────
FROM node:18-alpine AS runner

# Install dumb-init agar signal handling benar di container
RUN apk add --no-cache dumb-init

WORKDIR /app

# Buat user non-root untuk keamanan
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Copy dari stage deps
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY --chown=nodejs:nodejs src ./src
COPY --chown=nodejs:nodejs public ./public
COPY --chown=nodejs:nodejs package.json ./

# Jalankan sebagai user non-root
USER nodejs

# Port yang digunakan aplikasi
EXPOSE 3000

# Environment default
ENV NODE_ENV=production
ENV PORT=3000

# Health check — Railway akan monitor endpoint ini
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

# Jalankan server dengan dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/index.js"]

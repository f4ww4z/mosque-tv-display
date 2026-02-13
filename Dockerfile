# Build stage
FROM node:22-alpine3.21 AS builder

# Install dependencies for building (needed for sharp, bcrypt, etc.)
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Accept build arguments
ARG DATABASE_URL

# Set environment variables for build
ENV DATABASE_URL=${DATABASE_URL:-postgresql://dummy:dummy@db:5432/dummy?schema=public}


# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js app
RUN npm run build

# Production stage
FROM node:22-alpine3.21 AS runner

WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache libc6-compat

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

# SECURITY: Remove unnecessary packages and clear cache
RUN apk del --no-cache apk-tools python3 make g++ build-base cairo-dev jpeg-dev pango-dev giflib-dev && \
    rm -rf /var/cache/apk/* && \
    rm -rf /tmp/* && \
    rm -rf /root/.npm

# SECURITY: Restrict permissions
RUN chmod -R 755 /app && \
    chmod -R 555 /app/.next && \
    chmod -R 555 /app/prisma && \
    chmod 555 /app/server.js && \
    mkdir -p /app/storage && \
    chown nextjs:nodejs /app/storage && \
    chmod 755 /app/storage && \
    # Remove write permissions from unnecessary directories
    chmod -R a-w /app/public 2>/dev/null || true

# SECURITY: Switch to non-root user
USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]

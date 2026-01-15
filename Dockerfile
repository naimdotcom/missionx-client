# Multi-stage build for minimal image size
FROM node:20-alpine AS base

# 1. Base Setup
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app




# 2. Install ALL dependencies
# We need devDeps (like TypeScript) to build the project and transpile next.config.ts
FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json pnpm-lock.yaml ./
# Remove --prod so that TypeScript and other build tools are installed
RUN pnpm install --frozen-lockfile

# 3. Rebuild the source code
FROM base AS builder
WORKDIR /app

# Define Build Arguments
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ARG NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
ARG NEXT_PUBLIC_FIREBASE_API_HOSTING
ARG NEXT_PUBLIC_AUTH_SERVICE_URL
ARG NEXT_PUBLIC_APPS_SERVICE_URL
ARG NEXT_PUBLIC_CUSTOMER_SERVICE_URL
ARG NEXT_PUBLIC_WEBHOOK_SERVICE_URL


# Set them as Environment Variables for the build process
ENV NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ENV NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID
ENV NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=$NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
ENV NEXT_PUBLIC_FIREBASE_API_HOSTING=$NEXT_PUBLIC_FIREBASE_API_HOSTING
ENV NEXT_PUBLIC_AUTH_SERVICE_URL=$NEXT_PUBLIC_AUTH_SERVICE_URL
ENV NEXT_PUBLIC_APPS_SERVICE_URL=$NEXT_PUBLIC_APPS_SERVICE_URL
ENV NEXT_PUBLIC_CUSTOMER_SERVICE_URL=$NEXT_PUBLIC_CUSTOMER_SERVICE_URL
ENV NEXT_PUBLIC_WEBHOOK_SERVICE_URL=$NEXT_PUBLIC_WEBHOOK_SERVICE_URL

ENV NEXT_TELEMETRY_DISABLED=1

# Copy all node_modules (including build tools) from deps
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js - This will now find TypeScript for next.config.ts
RUN pnpm run build

# 4. Production runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone build
# Standalone mode automatically includes only the necessary production node_modules
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
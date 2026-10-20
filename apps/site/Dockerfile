# syntax=docker/dockerfile:1
#
# Chatovo public website — a Next.js server.
#
# The build context MUST be the monorepo root: the site depends on the
# `@chatovo/schemas`, `@chatovo/config` and `@chatovo/ui-kit` workspace packages.
# Build from the repo root with:
#   docker build -f apps/site/Dockerfile -t chatovo-site .
#
# The site renders on a server rather than shipping a static export, so pages,
# metadata and the download list reflect server state. Caddy (the web image)
# sits in front of it on chatovo.ru and terminates TLS.
#
# NEXT_PUBLIC_* values are inlined at build time and must be passed as build
# args. API_INTERNAL_URL is read at runtime and set in docker-compose.yml.

# ---- Build stage ----
FROM oven/bun:1.3.14 AS build
WORKDIR /app

ARG NEXT_PUBLIC_APP_URL
ENV NODE_ENV=production \
    NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}

# Bun's --frozen-lockfile validates the on-disk workspace topology against the
# lockfile, so every workspace manifest must be present, used here or not.
COPY package.json bun.lock ./
COPY apps/web/package.json ./apps/web/package.json
COPY apps/server/package.json ./apps/server/package.json
COPY apps/site/package.json ./apps/site/package.json
COPY apps/tauri/package.json ./apps/tauri/package.json
COPY packages/config/package.json ./packages/config/package.json
COPY packages/schemas/package.json ./packages/schemas/package.json
COPY packages/ui-kit/package.json ./packages/ui-kit/package.json
COPY packages/tsconfig ./packages/tsconfig
RUN bun install --frozen-lockfile --ignore-scripts

COPY packages/config ./packages/config
COPY packages/schemas ./packages/schemas
COPY packages/ui-kit ./packages/ui-kit
COPY apps/site ./apps/site

# Bun 1.3.x segfaults on process exit AFTER a successful build; the artifact is
# already written, so check for the server entrypoint instead of the exit code.
RUN bun --filter @chatovo/site build; test -f apps/site/.next/standalone/apps/site/server.js

# ---- Runtime stage ----
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S nextjs -G nodejs

# `output: 'standalone'` traces the runtime dependencies into .next/standalone,
# laid out from `outputFileTracingRoot` (the monorepo root), so the entrypoint
# keeps its apps/site prefix. static/ and public/ are not traced: copy them in.
COPY --from=build --chown=nextjs:nodejs /app/apps/site/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/apps/site/.next/static ./apps/site/.next/static
COPY --from=build --chown=nextjs:nodejs /app/apps/site/public ./apps/site/public

USER nextjs

EXPOSE 3000

CMD ["node", "apps/site/server.js"]

# syntax=docker/dockerfile:1
#
# Chatovo web app — static Next.js export served by Caddy.
#
# The build context MUST be the monorepo root, because the client depends on
# the `@chatovo/schemas`, `@chatovo/config`, `@chatovo/ui-kit` and `@chatovo/server`
# (type-only) workspace packages.
# Build from the repo root with:
#   docker build -f apps/web/Dockerfile -t chatovo-web .
#
# This image is the public edge: Caddy serves the app export on app.chatovo.ru,
# proxies chatovo.ru to the site container, api.* to the server and livekit.*
# to the SFU — so it is the only public-facing container (ports 80/443).
#
# The NEXT_PUBLIC_* values are baked into the static bundle at build time and
# must be passed as build args (they are not secrets — they ship to the browser).

# ---- Build stage: produce the static export ----
FROM oven/bun:1.3.14 AS build
WORKDIR /app

# NEXT_PUBLIC_* values, supplied by CI via --build-arg.
ARG NEXT_PUBLIC_API_URL=/api
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_LIVEKIT_URL
# Expose them to `next build` as environment variables.
ENV NODE_ENV=production \
    NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
    NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL} \
    NEXT_PUBLIC_LIVEKIT_URL=${NEXT_PUBLIC_LIVEKIT_URL}

# Install dependencies. Copy manifests first so the install layer is cached
# and only re-runs when a package.json / lockfile changes.
COPY package.json bun.lock ./
COPY apps/web/package.json ./apps/web/package.json
COPY apps/server/package.json ./apps/server/package.json
COPY packages/schemas/package.json ./packages/schemas/package.json
COPY packages/config/package.json ./packages/config/package.json
COPY packages/ui-kit/package.json ./packages/ui-kit/package.json
COPY packages/tsconfig ./packages/tsconfig
# Bun's --frozen-lockfile validates the on-disk workspace topology against the
# lockfile, so apps/tauri's manifest must be present even though this image
# doesn't use it.
COPY apps/site/package.json ./apps/site/package.json
COPY apps/tauri/package.json ./apps/tauri/package.json
RUN bun install --frozen-lockfile --ignore-scripts

# Copy the source needed to build the client.
COPY packages/schemas ./packages/schemas
COPY packages/config ./packages/config
COPY packages/ui-kit ./packages/ui-kit
COPY apps/server ./apps/server
COPY apps/web ./apps/web

# The client imports types from apps/server (which references the Prisma client
# at apps/server/generated/). Generate it before the Next.js typecheck runs.
# prisma.config.ts loads DIRECT_URL via env(); generate doesn't connect, so a
# placeholder satisfies the loader without baking any secret into the image.
RUN cd apps/server && DIRECT_URL="postgresql://placeholder" bunx prisma generate

# Produce the static export -> apps/web/out
# Bun 1.3.x segfaults on process exit AFTER a successful build (SIGILL, code 132);
# the artifact is already written, so validate the output dir instead of trusting
# Bun's exit code. A real build failure produces no `out` and still fails the image.
RUN bun --filter @chatovo/web build; test -d apps/web/out

# ---- Runtime stage: Caddy serving the static files ----
FROM caddy:2-alpine AS runner

# Caddy site config (serves static files + proxies /api).
COPY infra/caddy/Caddyfile /etc/caddy/Caddyfile

# The static export from the build stage.
COPY --from=build /app/apps/web/out /srv/www

EXPOSE 80 443

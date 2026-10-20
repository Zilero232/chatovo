import type { NextConfig } from 'next';

import { config as loadEnv } from 'dotenv';
import createNextIntlPlugin from 'next-intl/plugin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import rootPackage from '../../package.json' with { type: 'json' };

const siteRoot = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(siteRoot, '..', '..');

// The single `.env` lives at the monorepo root, while Next only looks next to the app.
// dotenv never overrides already-set variables, so CI and shell environment win.
loadEnv({ path: path.resolve(repoRoot, '.env'), quiet: true });

const nextConfig = {
  // A Node server in Docker behind Caddy. The standalone tree mirrors the
  // monorepo, so tracing starts at the repo root to keep workspace packages.
  output: 'standalone',
  outputFileTracingRoot: repoRoot,

  typedRoutes: true,
  reactCompiler: true,
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'avatars.githubusercontent.com' }]
  },

  env: {
    NEXT_PUBLIC_APP_VERSION: rootPackage.version
  },

  // Workspace packages ship TypeScript and SCSS sources, not builds.
  transpilePackages: ['@chatovo/config', '@chatovo/ui-kit'],

  // `loadPaths`: the app root for `@/...` and the workspace `node_modules` for
  // `@use '@chatovo/ui-kit/styles/...'` (Bun links workspace packages there).
  sassOptions: {
    implementation: 'sass-embedded',
    loadPaths: [siteRoot, path.resolve(repoRoot, 'node_modules')],
    quietDeps: true
  },

  turbopack: {
    resolveAlias: {
      '@': siteRoot
    }
  }
} satisfies NextConfig;

const withNextIntl = createNextIntlPlugin({
  requestConfig: './shared/i18n/request.ts'
});

export default withNextIntl(nextConfig);

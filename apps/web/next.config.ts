import type { NextConfig } from 'next';

import { IMAGE_DEVICE_SIZES, IMAGE_QUALITIES, IMAGE_SIZES } from '@chatovo/schemas/images';
import { config as loadEnv } from 'dotenv';
import createNextIntlPlugin from 'next-intl/plugin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import rootPackage from '../../package.json' with { type: 'json' };

const clientRoot = path.dirname(fileURLToPath(import.meta.url));

// The single `.env` lives at the monorepo root, while Next only looks next to the app.
// dotenv never overrides already-set variables, so CI and shell environment win.
loadEnv({ path: path.resolve(clientRoot, '..', '..', '.env'), quiet: true });

const nextConfig = {
  // Static export: served by Caddy on the web and bundled into the Tauri shell.
  // No SSR and no middleware.
  output: 'export',

  // The export has no built-in optimizer, so next/image goes through a custom loader
  // that points at the API's GET /images (sharp, disk cache). The width and quality
  // sets are shared with the server, which refuses anything outside them.
  images: {
    loader: 'custom',
    loaderFile: './shared/lib/image-loader/image-loader.ts',
    deviceSizes: IMAGE_DEVICE_SIZES,
    imageSizes: IMAGE_SIZES,
    qualities: IMAGE_QUALITIES
  },

  // Statically typed `<Link href>` and `router.push` — route types land in `.next/types`.
  typedRoutes: true,

  // React Compiler memoizes automatically; manual useMemo/useCallback stay only
  // where a semantically stable ref is required.
  reactCompiler: true,

  // Workspace packages ship TypeScript and SCSS sources, not builds.
  transpilePackages: ['@chatovo/config', '@chatovo/ui-kit'],

  // Strict mode is off: the double effect mount tears down the LiveKit room connection.
  reactStrictMode: false,

  env: {
    NEXT_PUBLIC_APP_VERSION: rootPackage.version
  },

  // `implementation: 'sass-embedded'` — native Dart binary, the fastest compiler.
  // `loadPaths`: the app root for `@/...` and the workspace `node_modules` for
  // `@use '@chatovo/ui-kit/styles/...'` (Bun links workspace packages there).
  // `quietDeps` silences deprecations coming from node_modules.
  sassOptions: {
    implementation: 'sass-embedded',
    loadPaths: [clientRoot, path.resolve(clientRoot, '..', '..', 'node_modules')],
    quietDeps: true
  },

  // `@` alias for Turbopack; the TS side lives in tsconfig `paths`.
  turbopack: {
    resolveAlias: {
      '@': clientRoot
    }
  }
} satisfies NextConfig;

const withNextIntl = createNextIntlPlugin({
  requestConfig: './shared/i18n/request.ts'
});

export default withNextIntl(nextConfig);

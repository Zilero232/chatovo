import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { parse as parseEnv } from 'dotenv';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';

import rootPackage from '../../../package.json' with { type: 'json' };
import { getTauriMobileHmrShim } from './src/shared/lib/tauri-mobile-hmr-shim';
import { APP_HEAD_TAGS } from './src/shared/seo';

const webRoot = import.meta.dirname;
const repoRoot = path.resolve(webRoot, '..', '..', '..');
const srcRoot = path.resolve(webRoot, 'src');

const DEV_PORT = 3000;

// The single `.env` lives at the monorepo root and also feeds the site, so the
// public variables keep their `NEXT_PUBLIC_` names.
const ENV_PREFIX = 'NEXT_PUBLIC_';

// Already-set variables win, so CI and the shell override the file.
const loadRootPublicEnv = () => {
  const file = path.resolve(repoRoot, '.env');

  if (!existsSync(file)) {
    return;
  }

  for (const [key, value] of Object.entries(parseEnv(readFileSync(file, 'utf8')))) {
    if (key.startsWith(ENV_PREFIX) && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
};

loadRootPublicEnv();

// Like `next build`, a build is always a production build: Bun auto-loads the
// root `.env`, whose NODE_ENV=development belongs to the server.
const forceProductionBuild = (command: 'build' | 'serve') => {
  if (command === 'build') {
    process.env.NODE_ENV = 'production';
  }
};

export default defineConfig(({ command, mode }) => {
  forceProductionBuild(command);

  return {
    plugins: [
      // React Compiler memoizes automatically; manual useMemo/useCallback stay only
      // where a semantically stable ref is required.
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      {
        name: 'chatovo:app-head',
        transformIndexHtml: () => {
          const shim = getTauriMobileHmrShim(mode);

          return shim
            ? [{ tag: 'script', children: shim, injectTo: 'head-prepend' }, ...APP_HEAD_TAGS]
            : APP_HEAD_TAGS;
        }
      }
    ],

    resolve: {
      alias: { '@': srcRoot }
    },

    // Vite reads no `.env` itself: the root one also carries the server's
    // NODE_ENV=development, which Vite would turn into a development build.
    // `loadRootPublicEnv` hands over the NEXT_PUBLIC_* values only.
    envDir: false,
    envPrefix: ENV_PREFIX,

    define: {
      'import.meta.env.NEXT_PUBLIC_APP_VERSION': JSON.stringify(rootPackage.version)
    },

    // `loadPaths`: `src/` for `@/...` and the workspace `node_modules` for
    // `@use '@chatovo/ui-kit/styles/...'` (Bun links workspace packages there).
    // `quietDeps` silences deprecations coming from node_modules.
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: [srcRoot, path.resolve(repoRoot, 'node_modules')],
          quietDeps: true
        }
      }
    },

    // Tauri expects a fixed port and its own error output. The server listens on
    // every interface (the dev Caddy container and a physical Android device reach
    // it from outside) and answers the dev Caddy hosts.
    clearScreen: false,
    server: {
      port: DEV_PORT,
      strictPort: true,
      host: true,
      allowedHosts: ['.chatovo.localhost']
    },
    preview: {
      port: DEV_PORT,
      strictPort: true
    },

    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: Boolean(process.env.TAURI_ENV_DEBUG)
    }
  };
});

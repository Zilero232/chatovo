import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  test: {
    name: 'web',
    environment: 'jsdom',
    globals: true,
    env: {
      NEXT_PUBLIC_API_URL: 'http://localhost:4000',
      NEXT_PUBLIC_LIVEKIT_URL: 'ws://localhost:7880',
      NEXT_PUBLIC_APP_VERSION: '0.0.0-test'
    },
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules/**', 'dist/**']
  },
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
      '@chatovo/schemas': resolve(import.meta.dirname, '../../../packages/schemas/src')
    }
  }
});

import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    name: 'site',
    environment: 'jsdom',
    globals: true,
    env: {
      NEXT_PUBLIC_APP_VERSION: '0.0.0-test'
    },
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules/**', '.next/**']
  },
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname),
      '@chatovo/schemas': resolve(import.meta.dirname, '../../packages/schemas/src')
    }
  }
});

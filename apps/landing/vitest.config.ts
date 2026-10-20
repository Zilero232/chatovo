import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'landing',
    environment: 'node',
    globals: true,
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

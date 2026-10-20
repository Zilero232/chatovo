import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'tauri',
    environment: 'node',
    globals: true,
    include: ['scripts/**/*.test.ts'],
    exclude: ['node_modules/**', 'gen/**', 'target/**']
  }
});

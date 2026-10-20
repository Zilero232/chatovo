import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      'packages/schemas/vitest.config.ts',
      'apps/server/vitest.config.ts',
      'apps/web/vitest.config.ts',
      'apps/site/vitest.config.ts',
      'apps/tauri/vitest.config.ts'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'packages/schemas/src/**',
        'apps/server/src/**',
        'apps/web/{entities,features,shared,widgets}/**',
        'apps/site/{entities,shared,views,widgets}/**'
      ],
      exclude: ['**/_tests/**', '**/*.types.ts', '**/index.ts']
    }
  }
});

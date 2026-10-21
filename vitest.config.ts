import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      'packages/schemas/vitest.config.ts',
      'packages/config/vitest.config.ts',
      'apps/server/vitest.config.ts',
      'apps/client/web/vitest.config.ts',
      'apps/landing/vitest.config.ts',
      'apps/client/native/vitest.config.ts'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'packages/schemas/src/**',
        'packages/config/src/**',
        'apps/server/src/**',
        'apps/client/web/src/{entities,features,pages,shared,widgets}/**',
        'apps/landing/{entities,shared,views,widgets}/**'
      ],
      exclude: ['**/_tests/**', '**/*.types.ts', '**/index.ts']
    }
  }
});

import { eslint } from '@siberiacancode/eslint';

export default eslint(
  {
    typescript: true,
    react: true,
    jsxA11y: true,
    ignores: [
      '**/node_modules',
      '**/.next',
      '**/out',
      '**/dist',
      '**/generated',
      '**/next-env.d.ts',
      '**/target',
      'apps/tauri/gen',
      'apps/server/prisma/migrations',
      // Module augmentation (use-intl / next-intl messages, the router register,
      // Vite's import.meta.env) only works with `interface`.
      'apps/web/src/messages.d.ts',
      'apps/web/src/router-register.d.ts',
      'apps/web/src/vite-env.d.ts',
      'apps/site/messages.d.ts',
      'docs/**',
      '**/*.md/**'
    ]
  },

  // The shared config applies these to every language it parses, and they throw
  // on JSON/YAML ("rules do not support the language jsonc/x") — without this
  // block eslint refuses to start at all.
  {
    name: 'chatovo/data-files',
    files: ['**/*.json', '**/*.json5', '**/*.jsonc', '**/*.yaml', '**/*.yml', '**/*.toml'],
    rules: {
      'arrow-body-style': 'off',
      'import/newline-after-import': 'off',
      'no-console': 'off',
      'prefer-template': 'off',
      'unicorn/no-typeof-undefined': 'off',
      'unicorn/no-useless-spread': 'off'
    }
  },

  {
    name: 'chatovo/typescript',
    files: ['**/*.?([cm])[jt]s?(x)'],
    rules: {
      // `type` everywhere, never `interface` — see the root CLAUDE.md.
      'ts/consistent-type-definitions': ['error', 'type'],
      // Bun and Node both provide these as globals; the rule wants a CJS
      // require() that has no place in an ESM workspace.
      'node/prefer-global/buffer': 'off',
      'node/prefer-global/process': 'off'
    }
  },

  // Sorting manifest keys is pure churn and fights the conventional field order.
  {
    name: 'chatovo/manifests',
    files: ['**/package.json', '**/tsconfig*.json'],
    rules: {
      'jsonc/sort-keys': 'off'
    }
  },

  {
    name: 'chatovo/server',
    files: ['apps/server/**'],
    rules: {
      // Nest resolves dependencies from decorator metadata, which `import type`
      // erases — the app then fails to boot with "Nest can't resolve".
      'ts/consistent-type-imports': 'off',
      // main.ts is an ESM entrypoint Bun runs directly.
      'antfu/no-top-level-await': 'off'
    }
  },

  // Console is the output channel of a CLI script, not a leftover debug line.
  {
    name: 'chatovo/scripts',
    files: ['**/scripts/**'],
    rules: {
      'no-console': 'off'
    }
  },

  // `next dev` appends its own `# This is NOT the Next.js you know` block to
  // apps/site/CLAUDE.md on every run and re-adds it when removed, so the
  // second H1 is not ours to fix.
  {
    name: 'chatovo/agent-docs',
    files: ['**/CLAUDE.md'],
    rules: {
      'markdown/no-multiple-h1': 'off'
    }
  }
);

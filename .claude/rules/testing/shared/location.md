---
paths:
  - '**/_tests/**/*.{ts,tsx}'
  - 'e2e/**/*.spec.ts'
  - '**/vitest.config.*'
  - 'playwright.config.ts'
  - 'apps/client/web/vitest.setup.ts'
  - 'apps/landing/vitest.setup.ts'
---

<!-- Compressed editing rules, loaded automatically when a test or its config is edited. -->
<!-- The full reasoning is docs/guides/shared/testing.md; keep them in sync. -->

# Tests — where they live

A unit test goes in `_tests/` next to the file under test, named after it: `initials.ts` → `_tests/initials.test.ts`. Not `__tests__`, not beside the source, not a root `tests/` tree. E2E specs live only in the root `e2e/` as `*.spec.ts`.

---
paths:
  - '**/_tests/**/*.{ts,tsx}'
  - 'e2e/**/*.spec.ts'
  - '**/vitest.config.*'
  - 'playwright.config.ts'
  - 'apps/web/vitest.setup.ts'
  - 'apps/site/vitest.setup.ts'
---

<!-- Compressed editing rules, loaded automatically when a test or its config is edited. -->
<!-- The full reasoning is docs/guides/shared/testing.md; keep them in sync. -->

# Tests — running them

`bun run test` from the root — one Vitest run over the root `vitest.config.ts` `test.projects` (`schemas`, `server`, `web`, `site`, `tauri`). **Never bare `bun test`**: that is Bun's own runner, not Vitest. `bun run test:e2e` runs Playwright: `app-desktop` / `app-mobile` over `e2e/app/**` on :3000, `site-desktop` / `site-mobile` over `e2e/site/**` on :3001; it starts both dev servers itself unless `E2E_APP_URL` / `E2E_SITE_URL` are set. CI runs `bun run test` only.

Environments: web and site — jsdom + `@testing-library/react`, setup in `apps/{web,site}/vitest.setup.ts` (the web one mocks `next/navigation`); server — node with a dummy env in its config (a new required env var goes there too, or the Prisma chain fails Zod validation on import); schemas — node, no env.

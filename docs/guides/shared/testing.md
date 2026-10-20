# Tests — Vitest + Playwright

## Where they live

A unit test goes in a `_tests/` folder next to the file under test, named after it:

```text
shared/lib/initials/
├── initials.ts
├── index.ts
└── _tests/initials.test.ts
```

Not `__tests__`, not a bare test file beside the source, not a separate `tests/` tree at the workspace root. E2E specs live only in the root [e2e/](../../../e2e/) with a `.spec.ts` extension.

## How it runs

**`bun run test`, never bare `bun test`.** Bare `bun test` is Bun's own runner: it collects the same files and fails them, because it is not Vitest.

`bun run test` from the repo root — **one** Vitest run across the whole monorepo, wired through `test.projects` in the root [vitest.config.ts](../../../vitest.config.ts). Workspaces carry their own configs (`name`, environment, aliases); they have no `test` script of their own and don't need one.

E2E — `bun run test:e2e`, four projects: `app-desktop` / `app-mobile` run `e2e/app/**` against the web app (:3000), `site-desktop` / `site-mobile` run `e2e/site/**` against the site (:3001). The config starts both dev servers itself unless `E2E_APP_URL` and `E2E_SITE_URL` point at running targets. CI runs `bun run test` only.

## Environment

- **web** and **site** — jsdom, `@testing-library/react`, setup in [apps/web/vitest.setup.ts](../../../apps/web/vitest.setup.ts) and [apps/site/vitest.setup.ts](../../../apps/site/vitest.setup.ts) (both clean the DOM after each test; the web one also mocks `next/navigation`). Env is declared in each config — don't read `.env` from a test.
- **server** — node, with a dummy env in the config. Without it any import that pulls the Prisma chain fails Zod env validation. Adding a test for a module with a new required variable means adding that variable there too.
- **schemas** — node, no env.

## What to test

A test should catch a regression, not restate the implementation. Every bug fixed by hand is a test that was missing — write it while the failure is still understood.

**Always covered:**

| Kind | Why | Example in the repo |
| --- | --- | --- |
| Mappers and codecs | Silent data loss across the client/server line | `packages/schemas/src/chat/_tests/lib.test.ts` |
| Fallback branches | Unknown error code, malformed JSON, missing key — the paths users hit on a bad day | `shared/api/auth/_tests/unwrap-auth.test.ts` |
| Guards over user data | An email or id leaking into the UI is a privacy bug, not a cosmetic one | `modules/users/_tests/profile.test.ts` |
| Contracts between layers | A schema and its translations drifting apart ships a blank error message | `shared/i18n/_tests/error-locales.test.ts` |
| Rules with a threshold | Timers, counters and streaks fire for the wrong reason and nobody notices | `features/app/achievements/.../_tests` |
| Pure state derivation | What a feature shows in each state, without rendering it | `features/app/system-tray/api/_tests` |

**Distinguish carefully**, because these are where the bugs actually live: `null` vs `undefined` vs `0` vs `''`; the first render vs a real change (an effect firing on mount is not a user action); the empty collection; the value exactly on a boundary.

**A hook with real logic is worth testing** — `renderHook` from `@testing-library/react` plus `vi.useFakeTimers()` covers timers and counters that no pure function can. Mock the store it depends on, not the logic under test.

**Don't test**: thin wrappers over a library, getters, `index.ts` re-exports, markup with no logic, or that a mock was called with what you just passed it.

## Style

The no-comments rule for application code applies here too — the `it(...)` name describes behaviour, not mechanics. Write it as a claim about the system: `'falls back to INTERNAL_ERROR when no code is present'`, not `'test 3'` or `'checks the if branch'`.

One `describe` per exported function, one assertion idea per `it`. Shared fixtures go in a constant above `describe`, not in `beforeEach`, when they never mutate.

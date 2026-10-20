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

# Tests — what to test

A test catches a regression; it doesn't restate the implementation. Every bug fixed by hand is a missing test.

Always covered: mappers and codecs, fallback branches (unknown error code, malformed JSON), guards over user data, contracts between layers (schema ↔ translations), rules with a threshold (timers, counters), pure state derivation. A hook with real logic: `renderHook` + `vi.useFakeTimers()`.

Watch `null` vs `undefined` vs `0` vs `''`, the first render vs a real change, the empty collection, the exact boundary.

Don't test thin library wrappers, getters, re-exports, markup without logic, or that a mock got what you passed it.

The `it(...)` name is a claim about behaviour (`'falls back to INTERNAL_ERROR when no code is present'`). One `describe` per exported function, one idea per `it`; constant fixtures above `describe`, not in `beforeEach`. No comments.

---
paths:
  - '**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}'
---

<!-- Compressed editing rules, loaded automatically when a TS/JS file is edited. -->
<!-- The full reasoning is docs/guides/shared/comments.md; keep them in sync. -->

# Code style — TypeScript: comments

## No comments in application code

`pages/` (site: `views/`), `widgets/`, `features/`, `entities/` (client) and `modules/` (server) carry no `//`, block or JSDoc comments. A block that needs one becomes a named function.

## The narrow exception

An **exported** primitive of a reusable module — `packages/ui-kit`, `packages/config`, `shared/lib`, `shared/hooks`, server `src/lib/`, `packages/schemas` — may carry a 1–2 line JSDoc when the signature doesn't explain it (units, a side effect, an edge case). Internal helpers never.

Always allowed: `eslint-disable-next-line <rule> -- <reason>`, `@ts-expect-error` with a reason, `'use client'` (site and kit). Commented-out code and a `// TODO` without a ticket are banned everywhere. Leave pre-existing comments in files you didn't author.

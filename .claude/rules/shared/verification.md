---
paths:
  - '**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}'
---

<!-- Compressed editing rules, loaded automatically when a TS/JS file is edited. -->
<!-- The full reasoning is docs/guides/shared/checklist.md; keep them in sync. -->

# Verification

`bun run fix`, then `bun run verify` (typecheck + ESLint + Prettier + Stylelint). `bun run test` is separate — never bare `bun test`, which is Bun's own runner. `bun --filter @chatovo/client-web build` is the only check that catches a static-export breakage; `bun --filter @chatovo/landing build` catches site server/client boundary and metadata errors (`bun run build` runs both). `bun run lint:rust` when `apps/client/native` changed; `bun run lint:caddy` (fix with `format:caddy`) when `infra/caddy` changed — Caddy comes from mise.

`fix` does not fix blank lines, hook order or FSD boundaries.

A changed rule updates `docs/guides/` and its digest in `.claude/rules/` together. Never commit or push unless the user asks in that message — stage at most.

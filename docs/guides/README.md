# Chatovo Style Guide

Code-style conventions for `apps/web/`, `apps/site/`, `apps/server/` and `packages/`. Architectural rules for the two frontend apps (the Vite web app and the Next.js site) live in [`docs/architecture/fsd.md`](../architecture/fsd.md); the design decisions behind the product are in [`docs/architecture/`](../README.md#architecture). The compressed editing versions of these guides are the digests in [`.claude/rules/`](../../.claude/rules/), loaded automatically by path. A rule change goes into both.

Tools:

- **ESLint** (`bun lint` / `bun lint:fix`) — linter + import sorting (`perfectionist/sort-imports`). Config: the root `eslint.config.mjs` on top of `@siberiacancode/eslint` (`{ typescript: true, react: true, jsxA11y: true }`).
- **Prettier** (`bun format` / `bun format:check`) — formatter. Config: `prettier.config.mjs` (re-exports `@siberiacancode/prettier`), exclusions in `.prettierignore`.
- **Stylelint** (`bun lint:css` / `bun lint:css:fix`) — SCSS. Config: `stylelint.config.mjs` on top of `@siberiacancode/stylelint`; property order from `stylelint-config-idiomatic-order`.
- **TypeScript** strict, with `noUnusedLocals` and `noUnusedParameters` (`packages/tsconfig`).
- **clippy + rustfmt** for `apps/tauri` (`bun lint:rust`, `bun format:rust`).
- FSD boundaries, hook order and blank lines are kept by hand and caught at review — the linter covers none of them.

One command each way: `bun run verify` (typecheck + ESLint + Prettier + Stylelint) and `bun run fix` (ESLint --fix + Prettier + Stylelint --fix).

**Why ESLint + Prettier:** the shared `@siberiacancode/*` presets are reused across the author's projects — identical rules with no per-repo reconfiguration — and ESLint carries the React-specific rules (`rules-of-hooks`, `exhaustive-deps`, purity) that Biome lacks.

## Sections

The `§` numbers are the sections of the old single-file guide; reviews and commit messages still cite them.

### Client (`apps/web`, `apps/site`, `packages/ui-kit`)

- [Slice structure](client/slices.md) — §1
- [Slice `ui/` and `ui-kit`](client/slice-ui.md) — §2, §2.1, headless controllers
- [`model/hooks` structure](client/model-hooks.md) — §2.2
- [Styles and SCSS](client/styles.md) — §3, §12, animation
- [Component size](client/component-size.md) — §4
- [React conventions](client/react.md) — §10, §10.1, §10.1b, §10.2, §10.3
- [Component body order](client/component-body.md) — §10.1a
- [The `model/`, `lib/` and `api/` segments](client/segments.md) — §11
- [Forms](client/forms.md) — §15
- [Conditional render](client/conditional-render.md) — §16, §16.1
- [Drill cleanup](client/drill-cleanup.md) — §17
- [Base UI](client/base-ui.md) — the gotchas of the `ui-kit` primitives
- [i18n](client/i18n.md) — use-intl in the web app, next-intl on the site, locales, the locale tests
- [Tauri on the client](client/tauri.md) — `isTauri()` gating, desktop vs mobile

### Server (`apps/server`)

- [Server modules — NestJS](server/nestjs.md) — module shape, layers, validation, auth, realtime, domain events, config
- [Data — Prisma and Postgres](server/data.md) — schema, clients, moderation gates, uploads

### Shared (TypeScript everywhere)

- [Naming](shared/naming.md) — §5
- [Imports and barrels](shared/imports-and-barrels.md) — §6, §7
- [Types](shared/types.md) — §8, §8.1
- [Functions](shared/functions.md) — §9, §9.5, §9.6, object parameters
- [Readability](shared/readability.md) — §10.4, destructuring
- [Blank lines](shared/blank-lines.md) — §13
- [Shared schemas](shared/schemas.md) — §14
- [Comments](shared/comments.md) — §18
- [Dependencies](shared/dependencies.md) — reuse over reinvention, library gotchas, the catalog
- [Library references](shared/references.md) — context7 ids, when reading the docs is mandatory
- [Tests](shared/testing.md)
- [Forbidden](shared/forbidden.md) — §20
- [Checklist before a commit](shared/checklist.md) — §21, verification, the toolchain

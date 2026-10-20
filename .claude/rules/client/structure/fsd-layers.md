---
paths:
  - 'apps/web/**/*.{ts,tsx}'
  - 'apps/site/**/*.{ts,tsx}'
  - 'packages/ui-kit/**/*.{ts,tsx}'
---

<!-- Compressed editing rules, loaded automatically when a client file is edited. -->
<!-- The full reasoning is docs/architecture/fsd.md; keep them in sync. -->

# Client — FSD layers and public API

Feature-Sliced Design with two local tweaks: `pages` → `views`, slices grouped by business domain. Imports go downward only: `app → views → widgets → features → entities → shared`. The design system `@chatovo/ui-kit` (`packages/ui-kit`) sits beside `shared` in both apps (`apps/web`, `apps/site`): every layer may import it, it imports nothing from either app.

A **widget importing a feature is correct** — only feature → widget and entity → anything above are violations. Cross-imports between slices of one layer are banned.

## Public API

Import the slice (`@/features/auth/sign-in`), never the domain group (`@/features/auth`) and never past the barrel. The kit has one root barrel, `@chatovo/ui-kit` (plus `@chatovo/ui-kit/messages` and `@chatovo/ui-kit/styles/*`); shared constants come from `@chatovo/config`.

`shared/` holds no business logic — domain hooks and types go to `features/` or `entities/`. Settings state (`useAppSettings`) lives in `entities/app/settings`, not the settings widget.

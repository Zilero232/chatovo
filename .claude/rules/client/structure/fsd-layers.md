---
paths:
  - 'apps/client/web/**/*.{ts,tsx}'
  - 'apps/landing/**/*.{ts,tsx}'
  - 'packages/ui-kit/**/*.{ts,tsx}'
---

<!-- Compressed editing rules, loaded automatically when a client file is edited. -->
<!-- The full reasoning is docs/architecture/fsd.md; keep them in sync. -->

# Client — FSD layers and public API

Feature-Sliced Design with slices grouped by business domain. The web app uses the canonical `src/` root and `pages` layer; the site has no `src/` and names the layer `views` (a top-level `pages/` would enable Next's Pages Router). In the web app the app layer has no folder: `main.tsx`, `router/`, `providers/`, `styles/` sit at the top of `src/`. Imports go downward only: app → `pages → widgets → features → entities → shared`. The design system `@chatovo/ui-kit` (`packages/ui-kit`) sits beside `shared` in both apps (`apps/client/web`, `apps/landing`): every layer may import it, it imports nothing from either app.

A **widget importing a feature is correct** — only feature → widget and entity → anything above are violations. Cross-imports between slices of one layer are banned.

## Public API

Import the slice (`@/features/auth/sign-in`), never the domain group (`@/features/auth`) and never past the barrel. The kit has one root barrel, `@chatovo/ui-kit` (plus `@chatovo/ui-kit/messages` and `@chatovo/ui-kit/styles/*`); shared constants come from `@chatovo/config`.

`shared/` holds no business logic — domain hooks and types go to `features/` or `entities/`. Settings state (`useAppSettings`) lives in `entities/app/settings`, not the settings widget.

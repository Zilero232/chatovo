---
paths:
  - 'apps/client/web/**/*.scss'
  - 'apps/landing/**/*.scss'
  - 'packages/ui-kit/**/*.scss'
---

<!-- Compressed editing rules, loaded automatically when an SCSS module is edited. -->
<!-- The full reasoning is docs/guides/client/styles.md; keep them in sync. -->

# Client — styles

SCSS modules only (`*.module.scss`, imported as `s`); CSS-in-JS is banned. Tokens are CSS variables (`packages/ui-kit/styles/_tokens.scss`, pulled into each app's `globals.scss` (`apps/client/web/src/styles/`, `apps/landing/app/`) with `_keyframes` and the shared `_base`): `--space-*`, `--icon-*`, `--control-*`, colours, radii — no raw values where a token exists. Shared mixins: `@use '@chatovo/ui-kit/styles/mixins' as *` (also `breakpoints`, `functions`), never `../../../`.

The theme is dark, hard-coded on `<html className="dark">`. Property order is Stylelint's job — `bun lint:css:fix`.

No `@keyframes` for enter/exit — that is `motion`'s job. CSS keeps hover/focus transitions, infinite loops and decorative backgrounds.

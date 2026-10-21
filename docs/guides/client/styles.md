# Styles and SCSS

| Layer | Format |
|---|---|
| `packages/ui-kit/**` | `*.module.scss` + CSS variables from `styles/_tokens.scss` |
| widgets / features / pages (site: views) | `*.module.scss` |

| Case | Where |
|---|---|
| Component styles in `ui-kit` | `<Name>.module.scss` |
| Slice subcomponent styles | `<Name>.module.scss` |
| Joining module classes with an optional `className` prop | `clsx(...)` |
| Conditional classes | maps in TSX (`variantClass[variant]`) or SCSS modifiers |

The principle: JSX stays readable, and `s.root` / `s.header` tell you the structure.

## 12. Global styles and tokens

- Theme tokens, spacing and sizes are CSS variables in `packages/ui-kit/styles/_tokens.scss` (`--space-*`, `--icon-*`, `--control-*`, colours, radii); the shared global CSS is `styles/_base.scss`. Each app's `globals.scss` (`apps/client/web/src/styles/`, `apps/landing/app/`) `@use`s `@chatovo/ui-kit/styles/tokens`, `keyframes` and `base`, then adds only its own page-level rules.
- Dark theme is hardcoded as `<html className="dark">` (incompatible with `next-themes` + Tauri).
- Component styles are `*.module.scss`; shared mixins come from `@use '@chatovo/ui-kit/styles/mixins' as *` (likewise `breakpoints`, `functions`). The repo `node_modules` is on the Sass load paths in each app (`css.preprocessorOptions.scss.loadPaths` in the web app's `vite.config.ts`, `sassOptions.loadPaths` plus `transpilePackages` in the site's `next.config.ts`) — never a relative `../../` into the package.
- `clsx` joins module classes with the `className` prop.

## Animation

Enter/exit animations, layout transitions and stagger go through **`motion`** (`motion.div`, `AnimatePresence`, `useReducedMotion`). CSS keeps only hover/focus transitions, infinite loops (spinner, pulse) and decorative backgrounds. Don't write `@keyframes` for enter/exit: they don't react to state and they fight with motion. Overlays built on Base UI have their own two working approaches — see [Base UI](base-ui.md) ("Animating overlays").

## Stylelint

`bun lint:css:fix` (over `apps/client/web`, `apps/landing` and `packages/ui-kit`) sorts properties (`stylelint-config-idiomatic-order` on top of `@siberiacancode/stylelint`). Don't order properties by hand and don't argue with the output.

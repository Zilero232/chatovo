# CLAUDE.md — apps/web

Guidance for `@chatovo/web`, the product app — lobby, rooms, auth, admin. Extends the root [../../CLAUDE.md](../../CLAUDE.md); those rules still apply. The public website is a separate app, [apps/site](../site/CLAUDE.md).

**Vite + React 19 single-page app**, routed by **TanStack Router**, built into `dist/` and served by Caddy on app.chatovo.ru with an SPA fallback. The same build is the UI of the Tauri desktop and Android apps ([apps/tauri](../tauri/)). `/` redirects to `/lobby`; the app's pages are `noindex`. Why not Next, the route tree and the gotchas: [docs/architecture/web-app.md](../../docs/architecture/web-app.md).

Architecture is **Feature-Sliced Design** with two local tweaks: `pages` → `views`, and slices grouped by business domain; the design system is the `@chatovo/ui-kit` package beside `shared`. Full rules: [docs/architecture/fsd.md](../../docs/architecture/fsd.md); code style: [docs/guides/](../../docs/guides/README.md). The digests in `.claude/rules/client/` load automatically when you edit files here.

## Layer map

```text
index.html  # the page shell; head tags are injected from shared/seo by vite.config.ts
app/        # main.tsx (entry + global error boundary), router/ (route tree, search schemas),
            # routes/ (AuthedLayout, StandaloneLayout, NotFound, RouteError, RootRedirect),
            # providers/ (AppProviders, AuthedProviders, …), global-error/, globals.scss
views/      # whole screens per route (canon FSD: pages/)
widgets/    # large composable blocks, by domain: app/, chat/, layout/, room/, social/
features/   # user interactions with business value, by domain: app/, auth/, room/, social/
entities/   # base domain concepts, by domain: app/, auth/, room/, social/
shared/     # project-agnostic non-UI: api/ config/ constants/ hooks/ i18n/ lib/ seo/ (static head tags, noindex)
```

The design system is `packages/ui-kit` (`@chatovo/ui-kit`): primitives/ (base) components/ (composed) icons/ styles/ messages/.

Imports go downward only: `app → views → widgets → features → entities → shared`. `@chatovo/ui-kit` sits beside `shared` — every layer may import it, it imports nothing from the app. A **widget importing a feature is correct** (it composes them); only feature → widget and entity → up are violations.

## Conventions that bite

- **Public API**: import the slice (`@/features/auth/sign-in`), never the domain group (`@/features/auth`) or past the barrel.
- **`ui-kit`**: `import { Button } from '@chatovo/ui-kit'` — one root barrel, never a path into the package. Every component there is a PascalCase folder with its own `index.ts`. Inside the app there are **no per-component `index.ts`** files: `ui/components/index.ts` points straight at the file (`export { X } from './X/X'`). A primitive used by both apps goes in the package; an app-specific composite stays in the app.
- **`model/` barrels** live in subfolders (`model/hooks/index.ts`), never a slice-level `model/index.ts`.
- **SCSS shared imports**: `@use '@chatovo/ui-kit/styles/mixins' as *` (also `tokens`, `breakpoints`, `functions`, `keyframes`) — no `../../../` (`css.preprocessorOptions.scss.loadPaths` in `vite.config.ts` includes the repo `node_modules`).
- **No `'use client'`** — nothing here renders on a server. The directive stays only in `packages/ui-kit` and `apps/site`.
- **Navigation**: `useNavigate()` → `navigate({ to: ROUTES.lobby, replace: true })`, `<Link to={...}>`; the pathname is `useLocation({ select: (location) => location.pathname })`; search params come from `useSearch({ strict: false })`. `router.history.push(path)` only for a raw path string (deep links, the title-bar history).
- **Routes** live in `app/router/router.ts`; a route with search params gets a zod schema in `app/router/search.ts`. Params stay plain strings (`URLSearchParams`).
- **Rooms are `/room?id=…`**: `buildRoomSearch(id)` for `navigate`, `buildRoomHref(id)` for a copyable link. Invite links in the wild use the query form.
- **Images**: `Image` from `@chatovo/ui-kit` with a `sizes`, never a raw `<img>`; `AppProviders` gives it the `/images` loader (`IMAGE_CONFIG`).
- **Env**: `env` from `@/shared/config` (`import.meta.env.NEXT_PUBLIC_*` underneath — the prefix is shared with the site). Mode checks are `import.meta.env.MODE === 'development'`.
- **Settings state** (`useAppSettings`, the settings types) lives in `entities/app/settings`, not the `widgets/app/app-settings` widget, which is UI only.
- **Shared Zod schemas** come from `@chatovo/schemas`, never inline.
- **Query keys** all live in `shared/constants/query-keys.ts`.
- **i18n**: `useTranslations` from `use-intl`; keys in `shared/i18n/locales/{en,ru}/<namespace>.json`, plus the kit's `ui` namespace spread in from `uiMessages`. Don't edit the generated `messages.d.ts`.
- **Public pages live on the site.** Privacy and terms are absolute `https://chatovo.ru/...` links (`EXTERNAL_LINKS`, built on `@chatovo/config`) opened through `handleExternalLinkClick`, so Tauri hands them to the system browser; Caddy 301s site paths off app.chatovo.ru. Don't add marketing pages here.
- **Tauri**: every call behind `isTauri()` ([Tauri on the client](../../docs/guides/client/tauri.md)).
- Alias `@/*` → `apps/web/*`.

## Where to read more

| Topic                                                   | Doc                                                                                                            |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Vite, the router, what replaced each Next feature       | [web-app.md](../../docs/architecture/web-app.md)                                                               |
| Slices, `ui/`, `ui-kit`, `model/`, `lib/`, `api/`       | [docs/guides/client/](../../docs/guides/README.md)                                                             |
| Hook order, effects, query results, component body      | [react.md](../../docs/guides/client/react.md), [component-body.md](../../docs/guides/client/component-body.md) |
| Base UI gotchas (state attributes, `render`, animation) | [base-ui.md](../../docs/guides/client/base-ui.md)                                                              |
| Libraries to reuse and their gotchas                    | [dependencies.md](../../docs/guides/shared/dependencies.md)                                                    |
| The call that outlives navigation                       | [room-session.md](../../docs/architecture/room-session.md)                                                     |
| Tray, game activity, invisible mode                     | [docs/architecture/](../../docs/README.md#architecture)                                                        |

## Verification

```bash
bun --filter @chatovo/web typecheck
bun --filter @chatovo/web build   # the Vite build into dist/ — catches what typecheck can't
bun run test                      # the web project runs in jsdom
```

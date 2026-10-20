# CLAUDE.md — apps/web

Guidance for `@chatovo/web`, the product app — lobby, rooms, auth, admin. Extends the root [../../CLAUDE.md](../../CLAUDE.md); those rules still apply. The public website is a separate app, [apps/site](../site/CLAUDE.md).

**Next.js 16 / React 19**, App Router, built as a **static export** (`output: 'export'`) and served by Caddy on app.chatovo.ru. The same build is the UI of the Tauri desktop and Android apps ([apps/tauri](../tauri/)). `/` redirects to `/lobby`; the app's own pages are `noindex`.

Architecture is **Feature-Sliced Design** with two local tweaks: `pages` → `views`, and slices grouped by business domain; the design system is the `@chatovo/ui-kit` package beside `shared`. Full rules: [docs/architecture/fsd.md](../../docs/architecture/fsd.md); code style: [docs/guides/](../../docs/guides/README.md). The digests in `.claude/rules/client/` load automatically when you edit files here.

## Layer map

```text
app/        # Next.js routes (thin server wrappers) + providers/. No 'use client' in page/layout.
            #   (authed)/     — lobby, room, admin: the app behind a session
            #   (standalone)/ — auth and account-delete pages; one shared layout
views/      # whole screens per route (canon FSD: pages/)
widgets/    # large composable blocks, by domain: app/, chat/, layout/, room/, social/
features/   # user interactions with business value, by domain: app/, auth/, room/, social/
entities/   # base domain concepts, by domain: app/, auth/, room/, social/
shared/     # project-agnostic non-UI: api/ config/ constants/ hooks/ i18n/ lib/ seo/ (app metadata, noindex)
```

The design system is `packages/ui-kit` (`@chatovo/ui-kit`): primitives/ (base) components/ (composed) icons/ styles/ messages/.

Imports go downward only: `app → views → widgets → features → entities → shared`. `@chatovo/ui-kit` sits beside `shared` — every layer may import it, it imports nothing from the app. A **widget importing a feature is correct** (it composes them); only feature → widget and entity → up are violations.

## Conventions that bite

- **Public API**: import the slice (`@/features/auth/sign-in`), never the domain group (`@/features/auth`) or past the barrel.
- **`ui-kit`**: `import { Button } from '@chatovo/ui-kit'` — one root barrel, never a path into the package. Every component there is a PascalCase folder with its own `index.ts`. Inside the app there are **no per-component `index.ts`** files: `ui/components/index.ts` points straight at the file (`export { X } from './X/X'`). A primitive used by both apps goes in the package; an app-specific composite stays in the app.
- **`model/` barrels** live in subfolders (`model/hooks/index.ts`), never a slice-level `model/index.ts`.
- **SCSS shared imports**: `@use '@chatovo/ui-kit/styles/mixins' as *` (also `tokens`, `breakpoints`, `functions`, `keyframes`) — no `../../../` (`sassOptions.loadPaths` includes the repo `node_modules`; `transpilePackages` in `next.config.ts`).
- **Settings state** (`useAppSettings`, the settings types) lives in `entities/app/settings`, not the `widgets/app/app-settings` widget, which is UI only.
- **Shared Zod schemas** come from `@chatovo/schemas`, never inline.
- **Query keys** all live in `shared/constants/query-keys.ts`.
- **Rooms are `/room?id=…`** (`buildRoomHref`): the static export has no SPA fallback, so a path segment 404s.
- **i18n**: `useTranslations` in client components, `getTranslations` in server ones; keys in `shared/i18n/locales/{en,ru}/<namespace>.json`, plus the kit's `ui` namespace spread in from `uiMessages`. Don't edit the generated `messages.d.ts`.
- **Public pages live on the site.** Privacy and terms are absolute `https://chatovo.ru/...` links (`EXTERNAL_LINKS`, built on `@chatovo/config`) opened through `handleExternalLinkClick`, so Tauri hands them to the system browser; Caddy 301s site paths off app.chatovo.ru. Don't add marketing pages here.
- **Tauri**: every call behind `isTauri()` ([Tauri on the client](../../docs/guides/client/tauri.md)).
- Alias `@/*` → `apps/web/*`.

## Where to read more

| Topic                                                   | Doc                                                                                                            |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Slices, `ui/`, `ui-kit`, `model/`, `lib/`, `api/`       | [docs/guides/client/](../../docs/guides/README.md)                                                             |
| Hook order, effects, query results, component body      | [react.md](../../docs/guides/client/react.md), [component-body.md](../../docs/guides/client/component-body.md) |
| Base UI gotchas (state attributes, `render`, animation) | [base-ui.md](../../docs/guides/client/base-ui.md)                                                              |
| Libraries to reuse and their gotchas                    | [dependencies.md](../../docs/guides/shared/dependencies.md)                                                    |
| The call that outlives navigation                       | [room-session.md](../../docs/architecture/room-session.md)                                                     |
| Tray, game activity, invisible mode                     | [docs/architecture/](../../docs/README.md#architecture)                                                        |

## Verification

```bash
bun --filter @chatovo/web typecheck
bun --filter @chatovo/web build   # catches what only the static export breaks
bun run test                      # the web project runs in jsdom
```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

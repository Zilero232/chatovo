# Feature-Sliced Design — Chatovo

The FSD methodology as applied to the two frontend apps: `apps/client/web/` (the product app, a Vite SPA — [web-app.md](web-app.md)) and `apps/landing/` (the public website, Next.js). Both follow the same layers, import rules, public APIs and segments; the shared design system is the `@chatovo/ui-kit` workspace package (§5.1). This document is the working reference for the frontend architecture.

Full specification: [feature-sliced.design](https://feature-sliced.design). Linter for FSD rules: [Steiger](https://github.com/feature-sliced/steiger).

> **Deviations from FSD canon in this project** (deliberate, reasons below):
>
> | FSD canon | Chatovo | Why |
> |---|---|---|
> | Root `src/` | Web: `apps/client/web/src/` as in canon. Site: the app root, `apps/landing/` (no `src/`) | The site is a Next.js app whose route files live in a root `app/`. `@/` → `apps/client/web/src/` and `apps/landing/` respectively. |
> | Layer `pages/` | Web: `pages/` as in canon. Site: `views/` | A top-level `pages/` in a Next.js app enables the Pages Router; `views/` sidesteps it. The Vite web app has no such clash. |
>
> Everywhere below, the site's `views/` is what the canon and the web app call `pages/`.

---

## 1. Layer hierarchy (top to bottom)

| # | Layer | Purpose | Slices? |
|---|---|---|---|
| 1 | App | Routing, providers, global styles, entrypoint | No |
| 2 | Pages *(site: Views)* | Whole screens / route-level compositions | Yes |
| 3 | Widgets | Large self-contained UI blocks (reusable or independent) | Yes |
| 4 | Features | User interactions with business value (forms, actions) | Yes |
| 5 | Entities | Core business concepts (user, room, message) | Yes |
| 6 | Shared | API client, utilities, i18n, config — project-agnostic | No |

The `Processes` layer is deprecated — its contents move into `Features` or `App`.

### Directory structure

```
apps/client/web/
├── index.html          # the page shell; entry /src/main.tsx
├── assets/icons/       # Tauri icon sources (app-icon*.svg)
└── src/
    ├── main.tsx        # App layer, spread over plain folders at the top of src/ (no app/ folder):
    ├── router/         #   route tree, search schemas, routes/ (layouts), global-error/
    ├── providers/      #   AppProviders, AuthedProviders and their parts
    ├── styles/         #   globals.scss
    ├── pages/          # Pages layer
    │   └── <page-name>/
    ├── widgets/        # Widgets layer
    │   └── <domain>/   # app | chat | layout | room | social
    │       └── <widget-name>/
    ├── features/       # Features layer
    │   └── <domain>/   # app | auth | room | social
    │       └── <feature-name>/
    ├── entities/       # Entities layer
    │   └── <domain>/   # app | auth | room | social
    │       └── <entity-name>/
    └── shared/         # Shared layer (no slices — segments only)
        ├── api/
        ├── config/
        ├── constants/
        ├── hooks/
        ├── i18n/
        ├── lib/
        └── seo/        # the static index.html head tags (noindex)

apps/landing/              # the public website, same layers, fewer slices
├── app/                # [locale]/ routes, sitemap, robots, llms.txt
├── views/              # Pages layer, named views/: home, features, download, changelog, about, support, legal, not-found
├── widgets/marketing/  # marketing-shell: header, footer, sections, scene
├── entities/release/   # server fetchers for release and contributor data
└── shared/             # config/ constants/ hooks/ i18n/ lib/ seo/

packages/ui-kit/        # @chatovo/ui-kit — the design system (no slices — segments only)
├── primitives/         # base: Button, Input, Dialog, …
├── components/         # composed: FormField, ConfirmDialog, …
├── icons/
├── messages/           # uiMessages: the `ui` namespace, spread into each app's messages
└── styles/             # _tokens, _mixins, _functions, _breakpoints, _keyframes, _base
```

> **Domain grouping of slices.** In Chatovo the slices inside `features/`, `entities/` and `widgets/` are grouped by business domain (`auth`, `room`, `app`, `layout`). This is a layer on top of the FSD canon (`<layer>/<slice>/`). Imports: `@/features/auth/sign-in`, `@/entities/room/room`, `@/widgets/layout/authed-shell`. The `app` group is cross-domain application infrastructure (release, locale, tray, shortcuts, update). The `layout` group is the root shell.

---

## 2. The golden rule: import direction

```
App → Pages → Widgets → Features → Entities → Shared
```

A module imports only from layers **strictly below** it. Banned:

- **Upwards** — a Feature cannot import from a Widget or a Page.
- **Sideways within a layer** — one Feature cannot import another Feature.

**Exception — cross-entity references.** When Entity A needs a type from Entity B, use the `@x` pattern: `entities/A/@x/B.ts` exports only what B needs from A.

---

## 3. Slices

A slice is a directory inside a layer, named after a **business domain** (not a technical role).

- ✓ Good: `user`, `room`, `auth`, `message`, `notification`
- ✗ Bad: `components`, `hooks`, `helpers`, `utils`

**Rules:**

- Every slice is isolated — zero coupling with neighbouring slices of the same layer.
- Related slices may be grouped into subfolders, but they stay independent.
- Slice names are kebab-case.

**Domain groups (Chatovo):** the `features/`, `entities/` and `widgets/` layers group slices by business domain:

- `auth/` — authentication (sign-in, sign-up, user)
- `room/` — rooms, voice, chat, presence
- `social/` — friends, profiles, social dialogs
- `app/` — application infrastructure (release, locale, system-tray, shortcuts, check-app-update)
- `chat/` (widgets only) — the chat panel
- `layout/` (widgets only) — the root shell

A domain folder is an organisational container, **not a public API**. Always import down to the slice level: `@/features/room/create`, not `@/features/room`.

---

## 4. Segments

Segments organise code inside a slice by technical purpose:

| Segment | Holds |
|---|---|
| `ui/` | Components, formatters, styles |
| `model/` | Types, interfaces, stores, schemas, business logic |
| `api/` | Backend requests, data mappers, query hooks |
| `lib/` | Internal utilities for this slice only |
| `config/` | Feature flags, constants, configuration |

Custom segments are allowed — name them after **what they do**, not what they are.
✗ Bad: `hooks/`, `components/`. ✓ Good: `model/`, `lib/`.

---

## 5. Public API (`index.ts`)

Every slice has an `index.ts` at its root, re-exporting the public interface.

```ts
// features/room/room-control/index.ts
export { RoomControlBar } from './ui/RoomControlBar';
export { useRoomControls } from './model/hooks';
export { DeafenProvider } from './model/contexts';
```

**Rules:**

- **No wildcard exports** — `export * from './ui/Foo'` is banned. Be explicit.
- **Minimal surface** — export only what other layers actually need.
- **External imports go through the slice index only** — never `@/features/auth/sign-in/ui/SignInForm` directly. Always `@/features/auth/sign-in`.
- **A domain group is not a public API** — `@/features/auth` does not exist; import the specific slice. The domain folder only organises files.
- **`model/` — barrels in the subfolders, not at the `model/` level.** `model/hooks/index.ts`, `model/contexts/index.ts`, `model/stores/index.ts` — each subfolder gets its own barrel. Do NOT create a slice-level `model/index.ts`. The slice `index.ts` and internal imports go through the subfolder: `./model/hooks`, `../model/contexts`. More in [guides/client/segments.md](../guides/client/segments.md).
- **No circular imports** — do not import from a slice's own `index.ts` inside that slice. Inside, use relative paths.

### 5.1. The design system — `@chatovo/ui-kit`

The design system is a workspace package, `packages/ui-kit`, shared by `apps/client/web` and `apps/landing`. It sits beside `shared/` in both apps: every layer may import it, and it imports nothing from either app.

- Segments: `primitives/` (base), `components/` (composed), `icons/`, `styles/`, `messages/`. **Every component gets its own PascalCase folder** (`primitives/Button/`, `components/FormField/`, …) with `Component.tsx`, `Component.module.scss`, optionally `Component.types.ts` and a mandatory `index.ts` barrel. The segment barrels and the root `index.ts` re-export everything.
- From outside, only `import { Button } from '@chatovo/ui-kit'`, never a path into it; the package's other exports are `@chatovo/ui-kit/messages` and `@chatovo/ui-kit/styles/*`. SCSS: `@use '@chatovo/ui-kit/styles/mixins' as *` (each app's Sass load paths include the repo `node_modules`; the package ships sources, so the site lists it in `transpilePackages` and Vite compiles it as part of the web app).
- Headless primitives come from **`@base-ui/react`**; styles are **SCSS modules**. Tokens live in `styles/_tokens.scss`; `styles/_base.scss` is the shared global CSS. Each app's `globals.scss` (`apps/client/web/src/styles/`, `apps/landing/app/`) `@use`s tokens, keyframes and base, then adds its own page-level rules.
- `messages/` exports `uiMessages` (namespace `ui`: the kit's own strings — close, loading, show password, …). Each app spreads `uiMessages.<locale>` into its messages. Kit components import `useTranslations` from `use-intl`, which works under the web app's `IntlProvider` and the site's `NextIntlClientProvider` alike. The kit imports no framework: images go through its own `Image` primitive, fed by an optional `ImageConfigProvider` loader.
- Shared non-UI constants (site URLs, legal, external links, site paths) live in `@chatovo/config`, not in the kit.

More in [guides/client/slice-ui.md](../guides/client/slice-ui.md) §2.1.

---

## 6. Routing integration

The app layer — in the web app `src/main.tsx`, `src/router/`, `src/providers/` and `src/styles/`; on the site `apps/landing/app/` — holds only routing, providers and global styles. All UI and logic lives in the pages layer — `pages/<name>/` in the web app, `views/<name>/` in the site; a route only points at a page.

**Web app (TanStack Router, code-based).** The route tree is one file, `src/router/router.ts`; each route names its page and, if it has search params, a zod schema:

```ts
// apps/client/web/src/router/router.ts
const roomRoute = createRoute({
  getParentRoute: () => authedRoute,
  path: ROUTES.room,
  validateSearch: roomSearchSchema,
  component: lazyRouteComponent(() => import('@/pages/room'), 'RoomPage')
});
```

Layouts are components in `src/router/routes/` (`AuthedLayout`, `StandaloneLayout`) that wrap an `<Outlet />` in their providers. No file carries `'use client'` — there are no server components. The why and the full tree: [web-app.md](web-app.md).

**Site (Next.js App Router).** Route files are thin server wrappers, without `'use client'`, that delegate into `views/`:

```tsx
// apps/landing/app/[locale]/features/page.tsx — server, thin
import { readPageLocale } from '@/shared/lib';
import { FeaturesPage } from '@/views/features';

const Page = async ({ params }: LocalePageProps) => (
  <FeaturesPage locale={await readPageLocale(params)} />
);

export default Page;
```

They contain only metadata, a wrapper and a default export.

> FSD canon recommends `export { Page as default } from '@/pages/...'` and an empty `pages/` with a `.gitkeep`. In the site the layer is named `views/`, so there is no clash with the Next.js Pages Router and no `.gitkeep` placeholder is needed. The route wrapper is written as an ordinary component (see above).

### Path aliases

`@/` points at `apps/client/web/src/` in the web app (as in canon) and at the app root `apps/landing/` in the site:

```jsonc
// apps/client/web/tsconfig.json
{ "compilerOptions": { "paths": { "@/*": ["./src/*"] } } }
// apps/landing/tsconfig.json
{ "compilerOptions": { "paths": { "@/*": ["./*"] } } }
```

---

## 7. Composition patterns

**Page** *(site: View)*:

```
Page
├── imports Widget A (self-contained block)
├── imports Widget B
├── imports Feature X (interactive element)
└── uses Shared UI primitives for layout
```

**Widget:**

```
Widget
├── imports Feature(s) for interactivity
├── imports Entity types/components for display
└── uses Shared UI primitives
```

**Feature:**

```
Feature
├── imports Entity types/hooks for domain data
└── uses the Shared API client, UI primitives, utilities
```

---

## 8. Checklist (check before every change)

- [ ] The file is in the correct layer directory
- [ ] Imports go downwards only — never up or sideways
- [ ] The slice has a public `index.ts` with explicit named exports
- [ ] No direct imports into a slice's internals from outside
- [ ] Directory and file names are kebab-case (exception — component folders: PascalCase)
- [ ] Component functions are named PascalCase exports (no default exports from slices)
- [ ] Segments describe purpose (`model/`, `api/`), not technical role (`hooks/`, `components/`)
- [ ] Route files are thin wrappers that delegate into the pages layer (`pages/` in web, `views/` in site)
- [ ] The Shared layer holds no business logic — project-agnostic code only
- [ ] The Entities layer holds no interaction UI logic — that is the Features level

> **Naming in Chatovo:** FSD canon requires kebab-case for every file. The Chatovo code style (see [guides/shared/naming.md](../guides/shared/naming.md)) uses kebab-case for slices and segments, **PascalCase for component folders and files** (`VoiceRoom/VoiceRoom.tsx`), and camelCase for hooks and utilities. This is a local convention on top of FSD.

---

## 9. Common mistakes

| Mistake | Fix |
|---|---|
| A Feature imports from another Feature | Move the shared logic into Entities or Shared |
| A Page holds business logic directly | Move it into a Feature, compose it in the Page |
| `shared/hooks/useSignIn.ts` | Auth is a business domain → `features/auth/sign-in/model/use-sign-in.ts` |
| A Widget imports from a Page | Invert it: the Page imports the Widget |
| A slice exports everything via `export *` | Explicit named re-exports |
| A `components/` folder at the layer root | Classify it: is it a Widget, a Feature, an Entity or Shared UI? |
| A route file holds the full page implementation | Move it into `pages/<name>/` (site: `views/<name>/`), leave the route a thin wrapper |

---

## Further reading

- Full specification: [feature-sliced.design](https://feature-sliced.design)
- Linter for FSD rules: [Steiger](https://github.com/feature-sliced/steiger)
- The `@x` cross-entity pattern — section 2 above
- The Chatovo code style on top of FSD (slice structure, naming, component size): [docs/guides/](../guides/README.md) — the full version; the compact auto-loaded digests are in [`.claude/rules/`](../../.claude/rules/)

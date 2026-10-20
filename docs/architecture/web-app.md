# The web app — a Vite SPA, not Next

`apps/client/web` (app.chatovo.ru, and the UI of the Tauri desktop and Android apps) is a single-page app built with **Vite + React 19** and routed by **TanStack Router**. The public website, `apps/landing`, stays on Next.js — it is the one that needs server rendering.

## Why Vite, not Next, for the web app

The app used to be a Next.js static export (`output: 'export'`). Once the public pages moved to `apps/landing`, Next gave this app nothing it used and kept costing:

- **File routing at the price of workarounds.** A static export has no SPA fallback, so a room could never be `/room/<id>` and every route needed its own `.html`. Caddy rewrote `/` to `/lobby.html` and matched `/room.html` for link previews.
- **`'use client'` everywhere.** Every component with a hook carried the directive, though nothing ever rendered on a server.
- **No middleware, no SSR, no optimizer** — the export disables all three, so `next/image` needed a custom loader anyway and `metadata` exports only produced a static head.
- **A heavier runtime and slower dev server** than a plain React bundle.

The app is a pure SPA behind auth with `noindex` pages. Vite gives it a fast dev server, a plain SPA fallback on the server (`try_files {path} /index.html`), the setup Tauri recommends, and no framework conventions to work around.

## Layout

A conventional Vite layout: `index.html`, the configs, `public/` and `assets/icons/` (the Tauri icon sources) at the package root; every source file under `src/`, which `@/` points at. `src/` holds the entry `main.tsx` and the app layer spread over plain folders — `router/` (route tree, search params, layouts, the crash screen), `providers/`, `styles/` — then the FSD layers `pages/`, `widgets/`, `features/`, `entities/`, `shared/`, plus the ambient `messages.d.ts`, `router-register.d.ts` and `vite-env.d.ts`. Without Next's Pages Router to dodge, the pages layer keeps its canonical name; the site still calls it `views/` ([fsd.md](fsd.md)).

## Routing

TanStack Router, **code-based** (`src/router/router.ts`): seven routes don't justify a generated `routeTree.gen.ts`, and one file shows the whole tree next to the layouts it mounts. Links, `navigate` and search params are fully typed through the `Register` augmentation in `src/router-register.d.ts`.

```text
root            component: Outlet · errorComponent: RouteError · notFoundComponent: NotFound
├── /           RootRedirect → /lobby
├── authed      (lazy) AppProviders > AuthedProviders > AuthedShell > Outlet
│   ├── /lobby          search: chat
│   ├── /room           search: id, title, view
│   └── /admin
└── standalone  AppProviders > Outlet
    ├── /auth
    ├── /auth/reset-password   search: token, error
    └── /account/delete
```

- **The call outlives navigation** because lobby, room and admin share the `authed` layout, which owns `RoomSessionProvider` and `RoomSessionHost` ([room-session.md](room-session.md)). The provider order is held by `src/providers/_tests/authed-providers-order.test.ts`.
- **Errors and 404s** are handled only at the root (`notFoundMode: 'root'`, no `defaultErrorComponent`), so an error anywhere replaces the layouts below it, as Next's root `error.tsx` did. A `CatchBoundary` around `RouterProvider` (`src/main.tsx`) replaces `global-error.tsx` for a crash in the providers themselves.
- **Search params are plain strings.** The router parses and stringifies them with `URLSearchParams` (`src/router/search.ts`), not its default JSON encoding, so invite links like `/room?id=…&title=Team+sync` keep their shape and a numeric-looking id stays a string. Each route validates its params with a zod schema.
- **Pages and the `authed` layout load lazily** (`lazyRouteComponent`), so each screen is its own chunk, as each Next page was, and `/auth` never downloads the signed-in shell (providers, chat, LiveKit).
- In components: `useNavigate()` for typed navigation (`navigate({ to: ROUTES.room, search: buildRoomSearch(id) })`), `useLocation({ select })` for the pathname, `useSearch({ strict: false })` outside a route's own page. `router.history` takes a raw path string (deep links, the title-bar history).

## The rest of the swap

| Next.js | Now |
| --- | --- |
| `next-intl` | `use-intl` — the same `IntlProvider` / `useTranslations`; `messages.d.ts` augments its `AppConfig` |
| `next/image` + `loaderFile` | `Image` from `@chatovo/ui-kit`, fed by `ImageConfigProvider` with `IMAGE_CONFIG` from `shared/lib/image-loader` ([images.md](images.md)) |
| `next/dynamic` | `React.lazy` inside a `Suspense fallback={null}` |
| `next/font` | `@fontsource-variable/{manrope,lora,jetbrains-mono}` behind the same `--font-sans/--font-serif/--font-mono` variables (`src/styles/globals.scss`) |
| `metadata` exports | static tags injected into `index.html` from `shared/seo` at build time; `DocumentTitleSync` still sets the localized title |
| `process.env.NEXT_PUBLIC_*` | `import.meta.env.NEXT_PUBLIC_*` — the prefix is kept (`envPrefix`) so the root `.env`, the Docker build args and the GitHub secrets feed the app and the site under one name |
| `out/` | `dist/` — Tauri's `frontendDist`, the `web` Docker image, Caddy's `/srv/www` |

## What it bought

Measured on 1.9.0 against the last Next export, both production builds served locally, Chromium, median of 7 cold loads (JS is the decoded size from Resource Timing):

| | Next export | Vite |
| --- | --- | --- |
| `vite build` / `next build` | minutes | ~7 s |
| `/auth` — JS downloaded | 2.49 MB | 1.10 MB (−56%) |
| `/auth` — sign-in form on screen | 295 ms | 215 ms (−27%) |
| `/auth` — `load` event | 234 ms | 99 ms (−58%) |
| `/lobby` signed out (redirect to `/auth`) — JS | 3.19 MB | 2.26 MB (−29%) |
| total JS / CSS in the build | — | −25% / −22% |

The signed-in lobby wasn't compared: the old export needs its own API origin to sign in.

## Keeping the first load small

The first chunk is whatever `main.tsx` reaches through static imports, so one eager import of a heavy module puts it on every page. Two things keep LiveKit (~1 MB) off `/auth`:

- **`sideEffects`** in `apps/client/web/package.json` and `packages/ui-kit/package.json` lists only styles (and `main.tsx`). Without it Rollup keeps every module a barrel re-exports — `shared/lib` re-exports `screen-share`, which imports `livekit-client` — even when nothing uses it. A new module with a top-level side effect that must run without any of its exports being used has to be added to that list.
- **The `authed` layout is lazy.** It mounts `AuthedProviders`, whose realtime syncs and chat panel import LiveKit hooks.

To find what drags a module into the entry, trace it at build time: a throwaway plugin whose `generateBundle` walks `this.getModuleInfo(id).importers` from the module up to the entry prints the chain.

## Gotchas

- **The root `.env` sets `NODE_ENV=development`** for the server, and Bun auto-loads it into every script. `vite.config.ts` therefore reads only the `NEXT_PUBLIC_*` keys from it (`envDir: false`) and forces `NODE_ENV=production` for `vite build`; otherwise the bundle ships development React.
- **The config loads through Vite's module runner** (`--configLoader runner` in the scripts): it imports `shared/seo`, which imports `@chatovo/config`, a workspace package of TypeScript sources that Node alone can't resolve.
- **The dev server listens on every interface** and allows `*.chatovo.localhost`, as `next dev` did, so the dev Caddy container and a physical Android device can reach it. The Tauri Android WebView loads the page from `tauri.localhost`; an inline shim (`shared/lib/tauri-mobile-hmr-shim`, injected only in dev) points Vite's HMR socket back at the host.

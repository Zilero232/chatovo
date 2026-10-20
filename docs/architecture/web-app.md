# The web app — a Vite SPA, not Next

`apps/web` (app.chatovo.ru, and the UI of the Tauri desktop and Android apps) is a single-page app built with **Vite + React 19** and routed by **TanStack Router**. The public website, `apps/site`, stays on Next.js — it is the one that needs server rendering.

## Why Vite, not Next, for the web app

The app used to be a Next.js static export (`output: 'export'`). Once the public pages moved to `apps/site`, Next gave this app nothing it used and kept costing:

- **File routing at the price of workarounds.** A static export has no SPA fallback, so a room could never be `/room/<id>` and every route needed its own `.html`. Caddy rewrote `/` to `/lobby.html` and matched `/room.html` for link previews.
- **`'use client'` everywhere.** Every component with a hook carried the directive, though nothing ever rendered on a server.
- **No middleware, no SSR, no optimizer** — the export disables all three, so `next/image` needed a custom loader anyway and `metadata` exports only produced a static head.
- **A heavier runtime and slower dev server** than a plain React bundle.

The app is a pure SPA behind auth with `noindex` pages. Vite gives it a fast dev server, a plain SPA fallback on the server (`try_files {path} /index.html`), the setup Tauri recommends, and no framework conventions to work around.

## Routing

TanStack Router, **code-based** (`app/router/router.ts`): seven routes don't justify a generated `routeTree.gen.ts`, and one file shows the whole tree next to the layouts it mounts. Links, `navigate` and search params are fully typed through the `Register` augmentation in `router.d.ts`.

```text
root            component: Outlet · errorComponent: RouteError · notFoundComponent: NotFound
├── /           RootRedirect → /lobby
├── authed      AppProviders > AuthedProviders > AuthedShell > Outlet
│   ├── /lobby          search: chat
│   ├── /room           search: id, title, view
│   └── /admin
└── standalone  AppProviders > Outlet
    ├── /auth
    ├── /auth/reset-password   search: token, error
    └── /account/delete
```

- **The call outlives navigation** because lobby, room and admin share the `authed` layout, which owns `RoomSessionProvider` and `RoomSessionHost` ([room-session.md](room-session.md)). The provider order is held by `app/providers/_tests/authed-providers-order.test.ts`.
- **Errors and 404s** are handled only at the root (`notFoundMode: 'root'`, no `defaultErrorComponent`), so an error anywhere replaces the layouts below it, as Next's root `error.tsx` did. A `CatchBoundary` around `RouterProvider` (`app/main.tsx`) replaces `global-error.tsx` for a crash in the providers themselves.
- **Search params are plain strings.** The router parses and stringifies them with `URLSearchParams` (`app/router/search.ts`), not its default JSON encoding, so invite links like `/room?id=…&title=Team+sync` keep their shape and a numeric-looking id stays a string. Each route validates its params with a zod schema.
- **Views load lazily** (`lazyRouteComponent`), so each screen is its own chunk, as each Next page was.
- In components: `useNavigate()` for typed navigation (`navigate({ to: ROUTES.room, search: buildRoomSearch(id) })`), `useLocation({ select })` for the pathname, `useSearch({ strict: false })` outside a route's own view. `router.history` takes a raw path string (deep links, the title-bar history).

## The rest of the swap

| Next.js | Now |
| --- | --- |
| `next-intl` | `use-intl` — the same `IntlProvider` / `useTranslations`; `messages.d.ts` augments its `AppConfig` |
| `next/image` + `loaderFile` | `Image` from `@chatovo/ui-kit`, fed by `ImageConfigProvider` with `IMAGE_CONFIG` from `shared/lib/image-loader` ([images.md](images.md)) |
| `next/dynamic` | `React.lazy` inside a `Suspense fallback={null}` |
| `next/font` | `@fontsource-variable/{manrope,lora,jetbrains-mono}` behind the same `--font-sans/--font-serif/--font-mono` variables (`app/globals.scss`) |
| `metadata` exports | static tags injected into `index.html` from `shared/seo` at build time; `DocumentTitleSync` still sets the localized title |
| `process.env.NEXT_PUBLIC_*` | `import.meta.env.NEXT_PUBLIC_*` — the prefix is kept (`envPrefix`) so the root `.env`, the Docker build args and the GitHub secrets feed the app and the site under one name |
| `out/` | `dist/` — Tauri's `frontendDist`, the `web` Docker image, Caddy's `/srv/www` |

## Gotchas

- **The root `.env` sets `NODE_ENV=development`** for the server, and Bun auto-loads it into every script. `vite.config.ts` therefore reads only the `NEXT_PUBLIC_*` keys from it (`envDir: false`) and forces `NODE_ENV=production` for `vite build`; otherwise the bundle ships development React.
- **The config loads through Vite's module runner** (`--configLoader runner` in the scripts): it imports `shared/seo`, which imports `@chatovo/config`, a workspace package of TypeScript sources that Node alone can't resolve.
- **The dev server listens on every interface** and allows `*.chatovo.localhost`, as `next dev` did, so the dev Caddy container and a physical Android device can reach it. The Tauri Android WebView loads the page from `tauri.localhost`; an inline shim (`shared/lib/tauri-mobile-hmr-shim`, injected only in dev) points Vite's HMR socket back at the host.

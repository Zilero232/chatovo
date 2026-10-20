# External documentation

Where the docs for our dependencies come from, and when reading them is mandatory.

**Nothing is vendored into this repo.** Third-party docs are fetched live through the **context7 MCP server**, which serves version-current pages. A copy checked into `docs/` would drift from the installed version within weeks and would be worse than no copy at all.

## How to fetch

Two calls, always in this order:

1. `resolve-library-id` — the library name plus what you are trying to do, returns a `/org/project` id.
2. `query-docs` — that id plus **one concept per call**. Split unrelated questions into separate calls.

The table below already carries the resolved ids, so step 1 can be skipped for anything listed here.

## Resolved library ids

| Area | Package (version) | context7 id |
| --- | --- | --- |
| Realtime media, SFU, tracks | `livekit-client` ^2.22.1 | `/livekit/livekit` |
| LiveKit React hooks | `@livekit/components-react` ^2.9.24 | `/livekit/components-js` |
| LiveKit platform guides | — | `/llmstxt/livekit_io_llms_txt` |
| Server token minting | `livekit-server-sdk` ^2.18.0 | `/livekit/livekit` |
| Auth (client + server) | `better-auth` ^1.7.2 | `/better-auth/better-auth` |
| Site framework | `next` ^16.3.4 | `/vercel/next.js` |
| Web app build | `vite` ^8.2.2, `@vitejs/plugin-react` ^6.1.1 | `/vitejs/vite`, `/vitejs/vite-plugin-react` |
| Web app routing | `@tanstack/react-router` ^1.170.0 | `/tanstack/router` |
| UI runtime | `react` ^19.2.8 | `/reactjs/react.dev` |
| Server state | `@tanstack/react-query` ^5.102.8 | `/tanstack/query` |
| API framework | `@nestjs/core` 11.1.29 | `/nestjs/docs.nestjs.com` |
| ORM | `prisma` ^7.9.1 | `/prisma/docs` |
| Validation | `zod` ^4.5.4 | `/colinhacks/zod` |
| UI primitives | `@base-ui/react` ^1.7.0 | `/mui/base-ui` |
| i18n | `next-intl` ^4.14.3 (site), `use-intl` ^4.14.3 (web, ui-kit) | `/amannn/next-intl` |
| Forms | `react-hook-form` ^7.87.0 | `/react-hook-form/documentation` |
| Animation | `motion` ^13.1.1 | `/motiondivision/motion` |
| Data helpers | `remeda` ^2.45.0 | `/remeda/remeda` |
| Pattern matching | `ts-pattern` ^5.9.0 | `/gvergnaud/ts-pattern` |
| Dates | `date-fns` ^4.4.0 | `/date-fns/date-fns` |
| Generic hooks | `@siberiacancode/reactuse` ^1.0.16 | resolve on demand |
| Desktop shell | `@tauri-apps/api` (Tauri 2) | `/tauri-apps/client/native` |

Ids for anything not listed: resolve it, then add the row here.

## When fetching is mandatory

Read the docs **before writing the code**, not after a failure, whenever the task involves:

- **A LiveKit API beyond the hooks we already use** — track publication options, device switching, `RoomOptions`, `setVolume` and its source argument, ICE and reconnection behaviour, egress, data channels, participant permissions. This SDK changes fast and its types under-document the runtime.
- **better-auth configuration** — session lifetime, hooks (`databaseHook`, `onError`), plugins, token transport, cookie versus Bearer, the Prisma adapter's schema expectations.
- **A Next.js file convention or an async API** (the site) — `params`/`searchParams`, metadata, route handlers, caching, the RSC boundary. Version 16 differs from every tutorial written for 13-15.
- **A TanStack Router or Vite API beyond what the web app already uses** — route options, search validation, loaders, `vite.config.ts` options.
- **A react-query behaviour that is not `useQuery(key, fn)`** — retry semantics, `gcTime` versus `staleTime`, invalidation, optimistic updates, the query and mutation caches.
- **A Prisma migration or a schema-level feature** — relation modes, multi-file schema, `db push` versus `migrate`, generator options. Repo specifics live in [ops/migrations.md](../../ops/migrations.md).
- **A Base UI primitive** — its parts, the render prop, portal and positioner behaviour, controlled state. Repo gotchas are in [client/base-ui.md](../client/base-ui.md).
- **A helper that might already exist** in remeda / ts-pattern / date-fns / reactuse — see [dependencies.md](dependencies.md). Checking the docs is cheaper than a hand-rolled helper that has to be reviewed and tested.

Skip fetching only for a mechanical edit inside code whose API is already visible in the file being edited.

## Precedence

Repo documents outrank library documents. When an external page suggests a pattern our own docs forbid — a `cn()` wrapper, `useState`-driven forms, a manual `fetch` — our rule wins. The library docs answer *how the API behaves*, never *how this project is written*.

Internal documents are indexed in [docs/README.md](../../README.md): [architecture/](../../architecture/) for how a subsystem works, [guides/](../README.md) for code style, [architecture/fsd.md](../../architecture/fsd.md) for layer rules, [ops/](../../ops/) for deploys and releases.

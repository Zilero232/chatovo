# Chatovo

Real-time voice rooms — web, desktop and Android. LiveKit SFU (WebRTC) carries the media with server-issued JWTs; a NestJS API owns accounts, rooms, chat and friends; a Tauri shell wraps the same web app. The public website (chatovo.ru) is a separate server-rendered app; the product lives on app.chatovo.ru. Bun-workspaces monorepo.

- Every doc, indexed: [docs/README.md](docs/README.md)
- Client architecture (FSD) — read before structural changes: [docs/architecture/fsd.md](docs/architecture/fsd.md)
- The call that outlives navigation: [docs/architecture/room-session.md](docs/architecture/room-session.md)
- The web app is a Vite SPA, not Next — routing, env, gotchas: [docs/architecture/web-app.md](docs/architecture/web-app.md)
- Things that have already bitten us: [docs/architecture/pitfalls.md](docs/architecture/pitfalls.md)
- Deploying the VPS: [docs/ops/deploy.md](docs/ops/deploy.md); releasing the apps: [docs/ops/release.md](docs/ops/release.md); migrations: [docs/ops/migrations.md](docs/ops/migrations.md)

Respond to the user in Russian. Code, identifiers, comments, docs and commit messages are in English. UI text is in nine languages — en, ru, uk, es, pt, de, fr, tr, pl — via use-intl (web) and next-intl (site).

## Layout

| Path                 | What                                                                                                                                                                                                                  |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/client/web`    | `@chatovo/client-web` — the product app (app.chatovo.ru): Vite + React 19 SPA, TanStack Router, FSD, SCSS modules, use-intl; also the UI of the Tauri apps — [CLAUDE.md](apps/client/web/CLAUDE.md)                   |
| `apps/landing`       | `@chatovo/landing` — the public website (chatovo.ru): Next.js 16, server-rendered (`output: 'standalone'`) in its own container, ru/en routing, SEO — [CLAUDE.md](apps/landing/CLAUDE.md)                             |
| `apps/server`        | NestJS 11 on Bun + Prisma 7 + self-hosted Postgres, auth via better-auth, the realtime gateway, LiveKit tokens — [CLAUDE.md](apps/server/CLAUDE.md)                                                                   |
| `apps/client/native` | Tauri 2 (Rust) shell for desktop and Android around `apps/client/web` — [CLAUDE.md](apps/client/native/CLAUDE.md)                                                                                                     |
| `packages/ui-kit`    | `@chatovo/ui-kit`: the design system shared by web and site — primitives, components, icons, SCSS tokens/mixins/base, the `ui` messages ([fsd.md §5.1](docs/architecture/fsd.md#51-the-design-system--chatovoui-kit)) |
| `packages/config`    | `@chatovo/config`: brand, URL and locale constants shared by web and site — `SITE`, `LEGAL`, `EXTERNAL_LINKS`, `SITE_PATHS`, `LOCALES`, `LOCALE_NAMES`, `OPEN_GRAPH_LOCALES`                                          |
| `packages/schemas`   | `@chatovo/schemas`: Zod contracts shared by the apps and the server, grouped by domain                                                                                                                                |
| `packages/tsconfig`  | the shared TypeScript presets                                                                                                                                                                                         |
| `infra/`             | Caddy (chatovo.ru → site, app.chatovo.ru → web, cross-host 301s) and LiveKit configs                                                                                                                                  |
| `.github/`           | `workflows/release.yml` (apps), `workflows/deploy.yml` (VPS), `actions/setup` (the mise toolchain)                                                                                                                    |
| `e2e/`               | Playwright specs: `e2e/app/**` against the web app (:3000), `e2e/landing/**` against the site (:3001)                                                                                                                 |
| `docs/`              | `architecture/` (the why), `guides/` (the full style guide), `ops/` (deploy, release, Google Play) — [index](docs/README.md)                                                                                          |
| `.claude/`           | `rules/` (path-scoped digests), `agents/style-reviewer.md`                                                                                                                                                            |

## Commands

```bash
mise install               # the pinned toolchain: bun, node, rust, caddy (mise.toml)
bun install
bun dev:full               # LiveKit + Caddy + Postgres in Docker, then web :3000 + site :3001 + server :4000
bun dev                    # web + site + server only (dev:web, dev:landing, dev:server for one)
bun --filter @chatovo/server db:push   # local schema iteration; shipped changes need a migration
bun run verify             # typecheck + ESLint + Prettier + Stylelint — before every commit
bun run fix                # every autofixer, in the same order
bun run commit             # commit-jazzer: type, scope, title → `feat(web): ✨ …`
bun run test               # Vitest, every workspace (never bare `bun test`)
bun run test:e2e           # Playwright: app-* projects on :3000, site-* on :3001 (E2E_APP_URL / E2E_LANDING_URL)
bun run build              # web Vite build + site standalone build; build:web / build:landing for one
bun run lint:rust          # clippy on apps/client/native (needs cargo)
bun run format:caddy       # caddy fmt on infra/caddy/Caddyfile*; lint:caddy checks format + config
bun tauri:dev              # desktop dev shell; bun android:dev for Android
```

**`bun run test`, never `bun test`.** Bare `bun test` is Bun's own runner, not Vitest.

**One `.env`** at the repo root serves web, site and server (`.env.example` is the template); the site loads it in `next.config.ts`, the web app reads its `NEXT_PUBLIC_*` keys in `vite.config.ts`. Only `apps/client/native/.env` is separate (machine-specific Android SDK/NDK/JDK paths). Release and deploy credentials live only in GitHub Secrets; each workflow lists the ones it needs in its header.

## Release and deploy

Only through GitHub Actions. **Release**: bump `version` in the root `package.json`, push a `v*` tag — checks, then desktop (Windows, macOS arm64 + x64, Linux) and the signed Android aab into one GitHub Release ([docs/ops/release.md](docs/ops/release.md)). **Deploy**: Actions → deploy → Run workflow — the web, site and server images built in parallel to ghcr, migrations, then `docker compose up -d` on the VPS ([docs/ops/deploy.md](docs/ops/deploy.md)). Every CI tool comes from [mise.toml](mise.toml) through `.github/actions/setup` (`jdx/mise-action`); bumping bun there also means the `oven/bun` tag in the web, site and server Dockerfiles.

## Rules

The full style guide is [docs/guides/](docs/guides/README.md) (split into `client/`, `server/`, `shared/`). Digests in `.claude/rules/` load automatically by path, one topic per file: `shared/` (TypeScript everywhere, docs), `client/` (web, site and ui-kit), `server/`, `tauri/`, `testing/`. A rule change updates the guide and its digest together. The key rules:

- **No comments in application code** (`pages/` — `views/` in the site — `widgets/`, `features/`, `entities/`, `modules/`). Only an exported primitive of a reusable module (`packages/ui-kit`, `shared/lib`, `shared/hooks`, server `src/lib/`, `packages/schemas`) may carry a 1–2 line JSDoc when its signature doesn't explain it ([comments](docs/guides/shared/comments.md)).
- **Two or more parameters → one object**; on the server the shape is `<Fn>Input` in `<module>.service.types.ts` ([functions](docs/guides/shared/functions.md)).
- **Types.** `type`, never `interface`; `unknown`, never `any` ([types](docs/guides/shared/types.md)).
- **Reuse over reinvention.** Before writing a helper, check `@siberiacancode/reactuse`, `remeda`, `ts-pattern`, `date-fns`, `motion`, `@base-ui/react`, `react-hook-form`, `@tanstack/react-query`, `@livekit/components-react`, `appBus` — and the known library gotchas ([dependencies](docs/guides/shared/dependencies.md)).
- **Library docs are fetched, never guessed** — through context7, with the ids in [references](docs/guides/shared/references.md). Mandatory before any LiveKit API beyond the hooks in use, better-auth config, Next 16 conventions, react-query past the basics, Prisma migrations, Base UI parts. Repo docs win where they disagree.
- **Dependency versions.** A version used by more than one workspace lives only in the root `workspaces.catalog` (`"zod": "catalog:"`).
- **FSD.** Imports go downward only; import a slice through its barrel; no business logic in `shared/` ([fsd.md](docs/architecture/fsd.md)).
- **Tauri.** Every Tauri call is behind `isTauri()` so the web build keeps working ([Tauri on the client](docs/guides/client/tauri.md)).
- **Let the code breathe and keep the order.** Blank lines between logical steps, hook order, component body order — held by hand, `bun run fix` doesn't do them ([blank lines](docs/guides/shared/blank-lines.md), [React](docs/guides/client/react.md)).
- **Tests** live in `_tests/` beside the source and cover logic, not markup ([tests](docs/guides/shared/testing.md)).
- **i18n.** Every user-visible string goes through use-intl / next-intl, in every locale — a new key lands in all nine files, translated ([i18n](docs/guides/client/i18n.md)).
- **Verify before claiming anything works** — `bun run verify`, `bun run test`, and `bun run build` for anything that could break the web export or the site build ([checklist](docs/guides/shared/checklist.md)).
- **Measure before swapping for perf.** A symptom that survives two library swaps is not the library: repeat the action, try a production build, or read a profile first.
- **No emojis in code** unless asked.
- **Git.** Never commit, branch or push unless the user asks in that message — stage (`git add`) at most. Conventional Commits with the type's emoji, written by [commit-jazzer](https://github.com/Zilero232/commit-jazzer) (`jazzer.config.ts`) and checked by commitlint (subject ≤ 120 chars): `bun run commit` asks the questions, and so does a plain `git commit` through the `prepare-commit-msg` hook; without a terminal pass the answers as flags — `bunx jazzer -t fix -s web -m "keep a muted mic silent" -b "…" -y` gives `fix(web): 🐛 keep a muted mic silent`. Feature branches off `master`.

Every `.md` is in English, except `docs/ops/google-play/listing.md` and the quoted store text in `docs/ops/google-play/moderation.md`, which are submitted to the store verbatim. A new design decision goes into the topical file under `docs/architecture/`, and [docs/README.md](docs/README.md) gets a line for any new doc.

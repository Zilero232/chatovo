# Pitfalls

Things that have already bitten us. Each one looked like a bug in our code, or a reason to swap a library, and was neither.

## Client

- **Rooms are addressed by a query param.** A room is `/room?id=…`, built by `buildRoomHref` / `buildRoomSearch` in `shared/lib`. It dates from the Next static export, which had no SPA fallback; invite links in the wild use it, so it stays, and the router keeps search params as plain `URLSearchParams` strings so those links still resolve ([web-app.md](web-app.md)).
- **The root `.env` makes a development build.** Its `NODE_ENV=development` is for the server, and Bun loads it into every script. `vite.config.ts` reads only the `NEXT_PUBLIC_*` keys and forces production for `vite build`; without that the web bundle ships development React.
- **A barrel re-export put LiveKit on the sign-in page.** `shared/lib` re-exports `screen-share`, which imports `livekit-client`; until `sideEffects` was declared, Rollup kept it in the entry chunk and `/auth` downloaded ~1 MB it never ran. Keep `sideEffects` in the web and ui-kit `package.json` and heavy screens behind `lazyRouteComponent` — [web-app.md](web-app.md#keeping-the-first-load-small).
- **The auth splash covers only the first load.** better-auth refetches the session on window focus, and `useCurrentUser` reports `isLoading` again. `AuthProvider` shows the splash only until the session has resolved once (`hasResolvedRef`); gating on `isLoading` alone remounted the whole tree on every tab switch and wiped the forms on the auth pages.
- **Leaving a room can re-open it.** `close()` is synchronous and `router.replace` is not, so the room page re-requested a token and re-opened the session it had just closed. The session context remembers `leftRoomId`; see [room-session.md](room-session.md).
- **A LiveKit processor restart drops the `AudioContext`.** `TrackProcessor.restart()` is called without one on a device change. The voice gate caches the context from `init` and falls back to it; without that it crashed on every microphone switch. LiveKit has no built-in noise gate, which is why that processor is our own (`entities/app/settings/lib/voice-gate`).
- **A private room's password prompt must be reachable without a grant.** Reading a room once required a LiveKit grant, which only the password gives — so the prompt asking for it could never render. Viewing (`assertCanViewRoom`) and entering (`assertCanAccessRoom`) are separate checks on the server.
- **An `outline` doesn't follow the corners of a rounded `overflow: hidden` card.** The participant card's speaking ring was an inset outline and showed square corners; a coloured border alone got clipped at the radius. It is now the card border plus an inner `::after` ring with radius `calc(var(--radius-2xl) - 1px)` — [visual-design.md](visual-design.md#the-app-keeps-its-layout).
- **Base UI menus fail silently.** A `DropdownMenuLabel` outside a group stops the menu from opening, with no console error. The full list is in [guides/client/base-ui.md](../guides/client/base-ui.md).

## Site

- **The standalone server must bind `HOSTNAME=0.0.0.0`.** Docker sets `HOSTNAME` to the container id, and Next's standalone `server.js` binds to it. next-intl's internal rewrite of a bare (Russian) path to `/ru/...` goes to `localhost`, misses the server and every page loops into a 307. The site Dockerfile sets `HOSTNAME=0.0.0.0`; keep it.
- **A page that fetches the API must be `force-dynamic`.** Otherwise `next build` prerenders it, fetching the API at build time — in CI there is none, and the page ships with empty data until revalidation.
- **The site can't know who is signed in.** The session token lives in the app origin's localStorage; the header CTA is a static link into the app.

## Server and production

- **`safeJsonParse` returns `{}` for a JSON array.** It is meant for objects (metadata, socket frames). An API that answers with an array — Radio Browser does — is parsed with `JSON.parse` in a `try` and validated with `z.array(...)`.
- **Missing Telegram notifications in production are the network.** The VPS is in Russia, where `api.telegram.org` is blocked. The bot goes through `TELEGRAM_PROXY_URL`; check that before debugging the notification code.
- **The dev database is on port 5433.** A Postgres installed on the host usually owns 5432; `P1000` against 5432 means the port is shadowed by it.
- **better-auth minor releases add columns.** A required column with no default fails the migration on a non-empty table — [ops/migrations.md](../ops/migrations.md).

## Desktop

- **The window icon is linked into the executable.** Swapping the icon files and restarting `bun tauri:dev` changes nothing; the binary has to be rebuilt (touch `build.rs` or clean the target).
- **An old icon in the taskbar jump list after an update is Windows' icon cache**, not the build. The binary and the AUMID are already right; clearing `iconcache_*.db` fixes the machine.
- **The start URL is `/lobby`.** `tauri.conf.json` opens it directly; `/` in the web app only redirects there.

## Android

- **Play rejects a bundle whose native lib is 4 KB aligned** ("must support 16 KB memory page sizes"). Up to 1.7.0 the aab was built with NDK r27c, whose linker aligned the `LOAD` segments of `libchatovo_lib.so` at `0x1000`; the zip side was already fine. NDK r28+ in CI and the rustflags in `apps/client/native/.cargo/config.toml` fix it — [ops/release.md](../ops/release.md#16-kb-page-size). The flags have to stay a `cfg(target_os = "android")` entry: the Tauri CLI sets `CARGO_TARGET_<TRIPLE>_RUSTFLAGS` itself, which would override a `[target.<triple>]` entry, while cargo joins a `cfg` entry with it.

## Tooling

- **`bun run test`, never bare `bun test`.** Bare `bun test` is Bun's own runner, not Vitest, and fails the suite.
- **`next dev` rewrites the site's `CLAUDE.md`** (`apps/landing`). The `<!-- BEGIN:nextjs-agent-rules -->` block is re-added on every run; committing it keeps the tree clean.
- **A performance symptom that survives two library swaps is not the library.** Repeat the action (a fast second time is first-mount or dev compilation), try a production build, or read a profile before swapping a third time.

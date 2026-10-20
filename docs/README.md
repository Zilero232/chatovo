# Documentation index

Everything under `docs/`, grouped by concern. Agent-facing editing digests live separately in [.claude/rules/](../.claude/rules/) (loaded by path) and in the `CLAUDE.md` files: [root](../CLAUDE.md), [apps/client](../apps/client/CLAUDE.md), [apps/server](../apps/server/CLAUDE.md), [apps/tauri](../apps/tauri/CLAUDE.md). The public overview is the [README](../README.md).

## Architecture

Design decisions — the "why" behind the code, and what has already gone wrong.

- [architecture/fsd.md](architecture/fsd.md) — Feature-Sliced Design as used by `apps/client`: layers, slices, segments, where a thing goes. Read before structural changes.
- [architecture/room-session.md](architecture/room-session.md) — the call outlives navigation: the session above the route, the collapsed bar, leaving without re-opening.
- [architecture/room-music.md](architecture/room-music.md) — music in a room: a shared queue for YouTube, SoundCloud and radio played by each listener's own embed, "My music" as a LiveKit track, ducking, and echo-free shared audio.
- [architecture/invisible-mode.md](architecture/invisible-mode.md) — an admin joins rooms hidden: server-enforced, presence filtered.
- [architecture/game-activity.md](architecture/game-activity.md) — the "Playing X" status, games only: Steam, Epic and GOG libraries plus the Windows Game Bar list; opt-in, desktop-only.
- [architecture/tray-menu.md](architecture/tray-menu.md) — the native tray: Rust owns the icon and menu, the client pushes labels and state.
- [architecture/images.md](architecture/images.md) — images without Next's optimizer: upload-time normalising, the `/images` resizer + `next/image` loader, chat link previews, SSRF-safe outbound fetches.
- [architecture/developer-role.md](architecture/developer-role.md) — `user.role = 'admin'`: the Developers tab, the badge, the contributors strip.
- [architecture/pitfalls.md](architecture/pitfalls.md) — things that have already bitten us.

## Guides

The style guide, split by stack. Index and tooling: [guides/README.md](guides/README.md).

- `guides/client/` — slices, `ui/` and `ui-kit`, `model/hooks`, segments, React, component body and size, styles and animation, forms, conditional render, drill cleanup, Base UI, i18n, Tauri on the client.
- `guides/server/` — [NestJS modules](guides/server/nestjs.md), [Prisma and Postgres](guides/server/data.md).
- `guides/shared/` — naming, imports and barrels, types, functions, blank lines, readability, comments, shared schemas, dependencies, library references, tests, forbidden list, pre-commit checklist.

## Ops

- [ops/deploy.md](ops/deploy.md) — the VPS: DNS, ports, the server's `.env`, self-hosted LiveKit, CI/CD secrets, first deploy, rollback.
- [ops/migrations.md](ops/migrations.md) — Prisma migrations: the baseline, the deploy order, better-auth schema drift.
- [ops/release.md](ops/release.md) — desktop and Android releases from a tag.
- [ops/google-play/](ops/google-play/README.md) — the Play release: listing, data safety, signing, moderation, store assets.

Config-local notes stay next to their config: [infra/livekit/README.md](../infra/livekit/README.md).

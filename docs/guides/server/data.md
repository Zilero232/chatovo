# Data — Prisma and Postgres

Prisma 7 on a self-hosted Postgres. Migrations, the deploy order and better-auth's schema drift are in [ops/migrations.md](../../ops/migrations.md).

## The schema

`apps/server/prisma/base.prisma` holds the generator and the datasource; the models are split per domain in `prisma/schema/*.prisma`: `auth`, `profile`, `room`, `message`, `friendship`, `moderation`, `push`.

better-auth owns `user` / `session` / `account` / `verification` (in `auth.prisma`), fully managed by Prisma — there is no introspected Supabase schema any more. Profile fields (`displayName`, `avatarUrl`, `bannerColor`, `bio`, `verified`) live in a separate `Profile` table, a 1-1 FK to `user`, created by a better-auth `databaseHook` on sign-up.

## Clients

- **`PrismaService`** (`core/`) is a plain `PrismaClient` subclass with `onModuleInit` / `onModuleDestroy`. Inject it and call models directly: `this.prisma.<model>`.
- No `$extends` and no global error mapping. Services check conflicts explicitly (`assertRoomNameAvailable` before a create or a rename) and throw the right `HttpException`.
- **`basePrisma`** (the raw client) is for better-auth and the plain-function guards in `src/lib/`. Never in feature services.

## Iterating locally

`bun db:push` (from `apps/server/`) applies the schema diff directly with no migration file — the fastest loop for a change that hasn't shipped. The moment a change has to reach production it needs a migration (`bun db:migrate`).

The dev database listens on **`localhost:5433`**, not 5432: a Postgres installed on the host usually owns 5432, and `P1000` (database not available) there means the port is shadowed, not that the container is down.

## Moderation gates

A blocked account (`user.blockedAt`) is refused by the global `BlockedUserGuard` (`common/guards/`, an `APP_GUARD` next to `ThrottlerGuard`), so every authenticated HTTP route is covered without per-route wiring; anonymous requests pass straight through. The two non-HTTP paths carry their own check: `LivekitService.issueRoomToken` (voice/video) and `RealtimeGateway.handleConnection` (a new socket). `assertCanAccessRoom` asserts it too, so room access stays closed even when called outside a request.

Blocking tears down what already exists: sessions, room grants, the live LiveKit participant and the open WebSocket.

A room ban (`room_bans`) is narrower — one room — but complete inside it: `assertCanAccessRoom` (the `access` tier of `assertRoomTier`) refuses a banned user with `ROOM_BANNED`, so history, sending, edits, attachments and music are shut, `filterAccessibleRooms` keeps the room out of their realtime subscription, the LiveKit token checks `assertNotRoomBanned`, and the `participant_joined` webhook removes them if they join with an older token. Bans are read through `findBannedRoomIds`, which exempts staff with `bypassRoomBans`. Room metadata (`view`) stays readable. Who may ban, mute or remove — the owner of a group room or staff with `moderateAnyRoom` — is `canModerateRoom`, asserted by `assertCanModerateRoom`; whom they may act on is the outrank rule in [roles](../../architecture/roles.md) ([moderation](../../ops/google-play/moderation.md#room-moderation)).

## Room visibility vs room access

`assertCanViewRoom` lets a user see a private room exists (and get its password prompt); `assertCanAccessRoom` gates entering it. Reading a room must not require a LiveKit grant, or the password prompt becomes unreachable ([pitfalls](../../architecture/pitfalls.md)).

## Files

Uploads (avatars, chat attachments) are written to the `UPLOADS_DIR` folder on disk by the server and served back under `/uploads`. There is no object storage.

Images are normalised with `sharp` on upload (avatars to WebP, EXIF stripped from chat photos, size and blur placeholder recorded) and resized on demand by `GET /images`. Every `/uploads` response is `immutable`: attachment keys are UUIDs and avatar URLs carry `?v=`. The whole pipeline, link previews and the SSRF rules for outbound fetches: [architecture/images.md](../../architecture/images.md).

Room invite links unfurl with the room name and live headcount: Caddy sends messenger crawlers (`TelegramBot`, `Discordbot`, `vkShare`…) hitting `/room` on the app host to `GET /link-preview/room`, which renders the Open Graph tags on the server.

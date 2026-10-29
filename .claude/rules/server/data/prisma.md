---
paths:
  - 'apps/server/**/*.ts'
  - 'apps/server/prisma/**'
---

<!-- Compressed editing rules, loaded automatically when a server file is edited. -->
<!-- The full reasoning is docs/guides/server/data.md and docs/ops/migrations.md; keep them in sync. -->

# Server — Prisma

Inject `PrismaService` and call models directly; no `$extends`, no global error mapping — check conflicts explicitly and throw. `basePrisma` is for better-auth and the `src/lib/` guards only.

The schema is split per domain in `prisma/schema/*.prisma`. Locally `bun db:push` (from `apps/server/`); anything that ships needs a migration (`bun db:migrate`). Never edit an applied migration; a required column on a non-empty table needs a default. The deploy runs `db:baseline` + `db:deploy` before `docker compose up -d`.

Blocked users are refused by `BlockedUserGuard` on HTTP; the LiveKit token and the WS connection check it themselves. A room ban (`room_bans`) is narrower — one room — but complete: `assertCanAccessRoom` and `filterAccessibleRooms` refuse it (`ROOM_BANNED`, staff with `bypassRoomBans` exempt via `findBannedRoomIds`), the LiveKit token checks `assertNotRoomBanned` and the `participant_joined` webhook removes a banned joiner; who may moderate a room is `canModerateRoom` / `assertCanModerateRoom`, and whom is the outrank rule ([roles](../../../../docs/architecture/roles.md)).

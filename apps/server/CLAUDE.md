# CLAUDE.md — apps/server

Guidance for the API. Extends the root [../../CLAUDE.md](../../CLAUDE.md); those rules still apply.

**NestJS 11 on Bun** + Prisma 7 (self-hosted Postgres) + better-auth (Bearer tokens). Realtime media via the LiveKit SFU with server-issued JWTs. Bun runs the TypeScript directly — no build step, no `dist`, no `@nestjs/cli`. The digests in `.claude/rules/server/` load automatically when you edit files here.

## Layout

```text
src/
├── main.ts        # bootstrap: global pipe/filter, CORS, helmet, pino, swagger, WS adapter, shutdown hooks
├── app.module.ts  # imports every feature module + the global infra modules
├── config/        # env schema (Zod) + AppConfigService, cors, livekit, uploads
├── core/          # Prisma: base-prisma (raw, for better-auth), PrismaService, PrismaModule (@Global)
├── common/        # decorators/ events/ exceptions/ filters/ guards/ notifications/
├── lib/           # cross-module guards and selects, one folder per function (assert-can-access-room, selectors…)
└── modules/       # auth badges chat email feedback friends github health livekit moderation
                   # notifications push realtime rooms shop telegram uploads users
prisma/
├── base.prisma    # generator + datasource
├── schema/        # auth, profile, room, message, friendship, moderation, push, shop
└── migrations/
```

## Conventions that bite

- **`services/` always** — one file per domain of work, never a fat `x.service.ts`; inputs as `<Fn>Input` in `<module>.service.types.ts`. Controllers validate, delegate, return.
- **Nothing but the class in a service or controller file.** Constants → `config/`, pure functions → `lib/<fn-name>/`.
- **Import another module through its barrel**, never into its files.
- **DTOs are `createZodDto(schema)`** with the schema from `@chatovo/schemas`; `class-validator` is banned.
- **Errors are thrown** `HttpException` subclasses; `AllExceptionsFilter` turns them into `{ error }`.
- **Every route is authenticated by default** (global `AuthGuard`); `@AllowAnonymous()` opens one, `@Session()` reads it. Admin checks are `assertIsAdmin` in the service.
- **Side effects go through domain events** — no Telegram/email/push imports in domain services.
- **Config only through `AppConfigService`**, never `process.env`.
- **The in-memory stores** (`connection-store`, `presence-store`, `call-store`) and `emit.ts` stay plain modules, not providers.
- **`basePrisma` is for better-auth** and the `src/lib/` guards — feature services inject `PrismaService`.

## Where to read more

| Topic                                                                       | Doc                                                                              |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Module shape, layers, validation, auth, realtime, domain events, config/ops | [docs/guides/server/nestjs.md](../../docs/guides/server/nestjs.md)               |
| Prisma, the schema, moderation gates, room view vs access, uploads          | [docs/guides/server/data.md](../../docs/guides/server/data.md)                   |
| Migrations, the baseline, better-auth schema drift                          | [docs/ops/migrations.md](../../docs/ops/migrations.md)                           |
| Invisible mode (admin joins hidden)                                         | [docs/architecture/invisible-mode.md](../../docs/architecture/invisible-mode.md) |
| The developer role                                                          | [docs/architecture/developer-role.md](../../docs/architecture/developer-role.md) |

## Commands (from apps/server/)

```bash
bun dev                # bun --hot; env validation fires at boot
bun db:push            # apply the schema diff (local iteration)
bun db:migrate         # create + apply a migration (anything that ships)
bun db:studio          # Prisma Studio
bun typecheck          # tsc --noEmit
```

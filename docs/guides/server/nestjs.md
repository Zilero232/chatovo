# Server modules — NestJS

**NestJS 11 on the Bun runtime** + Prisma + better-auth (Bearer tokens). Bun runs the TypeScript source directly: there is no `nest build`, no `dist`, and `@nestjs/cli` / SWC must not be added.

## Module shape

Each feature is a folder under `src/modules/<name>/`:

```text
modules/rooms/
├── index.ts                    # public API — the Module + the services others inject
├── rooms.module.ts             # @Module — controllers, providers, imports, exports
├── rooms.controller.ts         # transport only
├── services/
│   ├── index.ts
│   ├── rooms.service.types.ts  # <Fn>Input shapes, next to the services that use them
│   └── rooms.service.ts        # @Injectable — business logic
└── dto/
    └── rooms.dto.ts            # createZodDto(...) from @chatovo/schemas
```

- **`services/` always**, even for a single service — one file per domain of work, never a fat `<name>.service.ts` at the module root. `friends/` splits into `friendship` / `dm-room` / `friend-call`; `chat/` into `chat-message` / `chat-attachment`.
- **`index.ts` is the public API.** Another module is imported through its barrel (`from '../realtime'`), never a deep path (`from '../realtime/emit'`). Relative paths are for inside a module. Controllers and DTOs are not exported.
- Bigger modules keep the same shape with extra segments: `mappers.ts`, `listeners/` (event handlers), `handlers/` for a gateway's message handlers, in-memory `*-store.ts`. Match the neighbours.

## Nothing but the class

A service or controller file holds the class and nothing else:

- constants → `config/<name>.config.ts`;
- pure functions → `lib/<fn-name>/` — a folder per function: `<fn-name>.ts` + `index.ts` + `<fn-name>.types.ts` when it takes 2+ parameters;
- input shapes → `<module>.service.types.ts`.

**2+ parameters → one object**, typed `<Fn>Input`. Single-argument methods (`listFriends(userId)`) stay positional — the same rule as on the client ([functions](../shared/functions.md#object-parameters)). Nest constructors injecting collaborators positionally are the framework's convention and are exempt.

Cross-module helpers live in `src/lib/` with the same folder-per-function shape: the guards (`assertRoomExists`, `assertCanManageRoom`, `assertCanAccessRoom`, `assertIsAdmin`, `getUserWithProfile`) and the Prisma selects (`roomSelect`, `senderSelect`). They are plain functions over `basePrisma`, not providers — don't re-declare them per module.

## Layers

- **Controller** — transport only: validated input in (`@Body() dto`), a service call, a value out. No Prisma, no business rules. Let the return value serialise; don't hand-build responses.
- **Service** — business logic. Injects `PrismaService` (`this.prisma.<model>`), other services, `AppConfigService`, `EventEmitter2`. Takes plain arguments (never a `Request`), returns data or **throws** `ConflictException` / `NotFoundException` / `ForbiddenException` / `BadRequestException` from `@nestjs/common`.
- **Errors** are never built by hand: the global `AllExceptionsFilter` turns a throw into `{ error: string }`.

## Validation and OpenAPI — Zod is the single source of truth

- DTOs are **`createZodDto(schema)`** from **`nestjs-zod`**, with the schema from **`@chatovo/schemas`**. One schema drives request validation, the OpenAPI document and the client's form validation. `class-validator` / `class-transformer` are banned — they would fork the contract the client already validates against with `zodResolver`.
- `ZodValidationPipe` is global (`main.ts`); a bad body yields `{ error: "..." }` by itself.
- OpenAPI: `@nestjs/swagger` at `/docs` (+ `/docs-json`). `patchNestJsSwagger()` is gone in nestjs-zod v5 — wrap `SwaggerModule.createDocument(...)` in `cleanupOpenApiDoc(...)`. Annotate a response with `@ZodResponse({ type: SomeDto })` where a typed response matters.

## Auth — better-auth

- The instance is a module-level singleton in `modules/auth/auth.ts`, built from the validated env and shared by the CLI, the WS gateway and `AuthModule.forRoot({ auth })`. It uses `basePrisma`, not `PrismaService`.
- `@thallesp/nestjs-better-auth` registers a **global `AuthGuard`**: every route is protected by default (fail-closed). Open a route with **`@AllowAnonymous()`**, make auth optional with `@OptionalAuth()`, read the session with **`@Session()`** (`UserSession`).
- The body parser is off at bootstrap (`NestFactory.create(AppModule, { bodyParser: false })`) so better-auth reads the raw body; `express.json()` is re-applied for the rest of the API.
- Admin-only routes go through `assertIsAdmin` from `src/lib/` inside the service, never in the controller. Promoting a user is a database operation — [architecture/developer-role.md](../../architecture/developer-role.md).

## Realtime

One app WebSocket at `/realtime` (auth via `?token=`), a **`@WebSocketGateway`** on `@nestjs/platform-ws` (`WsAdapter`) — no SSE, no socket.io. `connection-store.ts` tracks sockets and domain events fan out through it. Presence is split: `livekit/presence-store.ts` is the pure in-memory store + pub/sub, `livekit/presence.ts` the LiveKit-SDK reconcile logic.

The in-memory stores (`connection-store`, `presence-store`, `call-store`) and `emit.ts` stay **plain modules, not providers**: they carry no request state, and the `bindRealtimeBroadcast` indirection deliberately breaks the `friends ↔ connection-store` import cycle. Don't drag them into DI.

## Side effects go through domain events

Domain services do not import Telegram / email / push. They inject `EventEmitter2` and emit a typed event from `common/events/domain-events.ts` (e.g. `DomainEvent.RoomCreated`); a `*.listener.ts` under `modules/notifications/` handles it and owns its own try/catch. Domain modules stay transport-agnostic, and a failing notification can't crash the request.

Plain modules that can't inject (`call-store`, `emit-chat-event`) raise events through **`emitDomainEvent`** from `common/events/emit-domain-event.ts`, a bridge bound once in `AppModule`, mirroring `bindRealtimeBroadcast`. A fire-and-forget `.then()` without `.catch()` is banned.

## Independent `await` calls

The shared rule holds — independent calls go through `Promise.all` ([functions](../shared/functions.md)). On the server the order matters more often, so don't parallelise a guard before a mutation (`assertCanManageRoom` → `delete`), an existence check before a related read, a write before reading the same data, or transaction steps.

```ts
// ✗ do NOT parallelise — the guard must run before the mutation
await assertCanManageRoom({ roomId, userId });
await this.prisma.room.delete({ where: { id: roomId } });
```

## Config and ops

- **Config**: `AppConfigService.get('KEY')` — typed and Zod-validated at boot, so a bad env fails fast. `process.env` and the raw `@nestjs/config` `ConfigService` are banned in feature code.
- **Rate limiting**: `@nestjs/throttler` — strict on `/auth/*` and `/feedback`, looser elsewhere.
- **Health**: `@nestjs/terminus` at `/health` actually pings Postgres; the Docker healthcheck depends on it.
- **Logging**: `nestjs-pino` — structured JSON with a request id, `pino-pretty` in dev.
- **Shutdown**: `app.enableShutdownHooks()` — `PrismaService.onModuleDestroy` closes the pool, the gateway closes its sockets.
- **Outbound calls from Russia**: the production VPS is in Russia, where `api.telegram.org` is blocked; the bot reaches it over IPv6 from the compose network. Missing pushes in production are that first, not a bug in the code ([pitfalls](../../architecture/pitfalls.md)).

## Local differences from the client style

- `import type` is not enforced (`ts/consistent-type-imports` is off for `apps/server/**`): Nest resolves dependencies from decorator metadata, which `import type` erases, and the app then fails to boot with "Nest can't resolve".
- Decorators are not comments; the no-comments rule doesn't touch them.
- `modules/` is application code — no comments. Only an **exported** helper in `src/lib/` may carry a 1–2 line JSDoc, when the signature doesn't explain the contract ([comments](../shared/comments.md)).

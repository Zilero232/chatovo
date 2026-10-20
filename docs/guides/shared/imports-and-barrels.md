# Imports and barrels

## Aliases

`@/` → the app root (`apps/web/` or `apps/site/`). Use it for everything except relative imports within the same folder. Workspace packages go by name: `@chatovo/ui-kit`, `@chatovo/config`, `@chatovo/schemas`.

## Group order

Sorting is done by the `perfectionist/sort-imports` rule from the `@siberiacancode/eslint` preset, applied via `bun lint:fix`. The groups, **with a blank line between them**:

1. **External types** — `import type` from packages.
2. **External value imports** — packages, `node:` builtins, `@chatovo/*`.
3. **Local types** — `import type` via the `@/` alias.
4. **Local value imports** — `@/` aliases.
5. **Relative types** — `import type` from `./` `../`.
6. **Relative value imports** — `./` `../`.
7. **Styles** — `*.css` / `*.scss`.

```ts
// 1. external types
import type { MouseEvent } from 'react';

// 2. external value
import { useForm } from 'react-hook-form';

// 3-4. local types and values via alias
import { useCurrentUser } from '@/entities/auth/user';

// 5. relative types
import type { VoiceRoomProps } from './VoiceRoom.types';

// 6. relative value
import { groupMessages } from '../lib/grouping';

// 7. styles
import s from './VoiceRoom.module.scss';
```

Within a group, alphabetical order. ESLint inserts the blank lines between groups on `bun lint:fix`; don't remove them by hand.

## Bans

A deep import past a barrel is banned:

```ts
// ✗ BANNED
import { ChannelsList } from '@/widgets/room/channels-panel/ui/components/ChannelsList';
import { Button } from '@chatovo/ui-kit/primitives/Button';

// ✓ OK
import { ChannelsPanel } from '@/widgets/room/channels-panel';
import { Button } from '@chatovo/ui-kit';
```

The design system has a single root barrel, `@chatovo/ui-kit` (the atomic layer stays under the hood); its only other entry points are `@chatovo/ui-kit/messages` and `@chatovo/ui-kit/styles/*`. Workspace packages (`@chatovo/ui-kit`, `@chatovo/config`, `@chatovo/schemas`) are imported by package name, never by a relative path. Inside a slice, relative imports are fine.

ESLint does not check FSD boundaries — we catch them at review.

## 7. Barrel exports (`index.ts`)

**Slice:**

```ts
// widgets/voice-room/index.ts
export { VoiceRoom } from './ui/VoiceRoom';
export type { VoiceRoomProps } from './ui/VoiceRoom.types';
```

Only what is needed from outside. Internal subcomponents are not exported.

**Component folder:**

```ts
// ui/VoiceRoom/index.ts
export { VoiceRoom } from './VoiceRoom';
export type { VoiceRoomProps } from './VoiceRoom.types';
```

**A subsystem in `model/`:** when a hook is assembled from several files in a subfolder, the `index.ts` next to them exports only the public entry point — the Provider and the hook. Internal modules and types stay in.

```ts
// entities/room/model/rooms-presence/index.ts
export { RoomsPresenceProvider, useRoomsPresence } from './rooms-presence-context';
```

Wildcard exports (`export * from`) are banned. Explicit named exports only.

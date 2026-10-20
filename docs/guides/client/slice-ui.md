# Slice `ui/` and `ui-kit`

The **main component** sits flat in `ui/`, with its files next to it:

```
widgets/voice-room/ui/
  VoiceRoom.tsx          ← JSX + entry component
  VoiceRoom.types.ts     ← Props and local union types
  VoiceRoom.module.scss  ← component styles
```

**Subcomponents** (used only inside the parent) go one per folder under `components/`:

```
widgets/channels-panel/ui/
  ChannelsPanel.tsx
  ChannelsPanel.module.scss
  components/
    index.ts                   ← `export { ChannelsHeader } from './ChannelsHeader/ChannelsHeader';`
    ChannelsHeader/
      ChannelsHeader.tsx
      ChannelsHeader.types.ts
      ChannelsHeader.module.scss
    ChannelsList/
      ...
```

**No per-component `index.ts` outside `ui-kit`.** In `views/`, `widgets/`, `features/` and `entities/` the aggregating `ui/components/index.ts` points straight at each file. A handful of older folders still carry their own `index.ts`; don't copy them. Only `ui-kit` gives every component folder a barrel (§2.1 below).

The parent imports through the barrel:

```ts
// ✓ OK
import { ChannelsHeader, ChannelsList } from './components';

// ✗ NOT OK
import { ChannelsHeader } from './components/ChannelsHeader';
```

**File rules:**

- `.types.ts` — create it only when there are Props or local union types.
- `.module.scss` — component styles (import as `import s from './Foo.module.scss'`). Mandatory on every layer.
- `packages/ui-kit/` — the design system (primitives/components/icons/styles/messages). **No flat `button.tsx`** — every primitive lives in a PascalCase folder (§2.1 below). From the apps, import `@chatovo/ui-kit`.

## 2.1. `ui-kit` structure

The kit is the workspace package `packages/ui-kit` (`@chatovo/ui-kit`), shared by `apps/web` and `apps/site`. In each app it acts as a layer next to `shared/`: every layer imports it, and it imports nothing from either app (no `@/` alias inside the package). Each component is its own PascalCase folder.

```
packages/ui-kit/
  index.ts                    ← re-export primitives + components + icons
  primitives/                 ← base, depend on no other component
    index.ts                  ← re-export every primitive
    Button/
      Button.tsx
      Button.module.scss
      Button.types.ts         ← optional
      index.ts                ← export { Button } from './Button';
                              ← export type { ButtonProps } from './Button.types';
    Dialog/
      Dialog.tsx
      Dialog.module.scss
      Dialog.types.ts
      index.ts
  components/                 ← composed, built out of primitives
    FormField/
      FormField.tsx
      FormField.module.scss
      index.ts
    ConfirmDialog/
      ...
  icons/
    LogoMark/
      LogoMark.tsx
      index.ts
  messages/                   ← en.json, ru.json → uiMessages (the `ui` namespace)
  styles/                     ← _tokens, _mixins, _functions, _breakpoints, _keyframes, _base
```

**Rules:**

- Component folder and file names are **PascalCase** (`Button/`, `Button.tsx`).
- **`primitives/` vs `components/`**: a primitive imports no other ui-kit component (beyond its own parts); anything assembled from two or more primitives belongs in `components/`.
- **A per-component `index.ts` is mandatory** — explicit named re-exports of the component and its types, no `export *`. Aggregating barrels (`primitives/index.ts`, the package's root `index.ts`) re-export the folders.
- Styles are **`*.module.scss`**; shared utilities are imported as `@use '@chatovo/ui-kit/styles/mixins' as *` — inside the kit as well as from the apps (each app's `sassOptions.loadPaths` includes the repo `node_modules`), so no `../../../`.
- Headless + a11y come from **`@base-ui/react`** (Dialog → `Dialog`, Menu → `Menu`, Select → `Select`, …); import from the package subpath.
- React types are **named imports** (`ComponentProps`, `ReactNode`, …), never `import type * as React`.
- Inside the kit, imports between segments are relative (`../../primitives/Button`). From the apps, only `@chatovo/ui-kit` (plus `@chatovo/ui-kit/messages` and `@chatovo/ui-kit/styles/*`).
- A user-visible string in a kit component goes through `useTranslations('ui')`, with the key in both `messages/*.json`.
- The kit knows nothing about either app: no routes, no API, no app i18n namespaces. Something only one app needs stays in that app.

## Slice barrel

```ts
// widgets/voice-room/index.ts
export { VoiceRoom } from './ui/VoiceRoom';
export type { VoiceRoomProps } from './ui/VoiceRoom.types';
```

## Headless controllers (`ui/controllers/`)

A side effect with no markup is a component that renders `null` and encapsulates one effect (sync mic state, sync tray, sounds, shortcuts). Each gets a folder under `ui/controllers/`, and they are assembled into a single orchestrator fragment:

```tsx
// ui/controllers/RoomControllers/RoomControllers.tsx
export const RoomControllers = ({ roomId }: RoomControllersProps) => (
  <>
    <RoomDeviceController />
    <MicStateController roomId={roomId} />
    <RoomSoundsController />
  </>
);
```

That way effects don't bloat the body of the main component, each is isolated and testable on its own. The alternative — "a pile of `useEffect` in `VoiceRoom.tsx`" — is banned (it blows the 100-line limit, section 4).

## Examples

**`VoiceRoom.types.ts`:**

```ts
import type { DisconnectReason } from 'livekit-client';

export type VoiceRoomProps = {
  roomName: string;
  serverUrl: string;
  token: string;
  onConnectFailure: (reason: DisconnectReason) => void;
  onLeave: () => void;
};
```

**`VoiceRoom.module.scss`:**

```scss
@use '@chatovo/ui-kit/styles/mixins' as *;

.root {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.header {
  display: flex;
  gap: var(--space-2);
  align-items: center;
  padding: var(--space-2) var(--space-4);
  border-bottom: 1px solid var(--glass-border);
}
```

Conditional variants use `cva` from `class-variance-authority` on top of the module classes (see `packages/ui-kit/primitives/Text/Text.variants.ts`).

**`VoiceRoom.tsx`:**

```tsx
'use client';

import s from './VoiceRoom.module.scss';
import type { VoiceRoomProps } from './VoiceRoom.types';

export const VoiceRoom = ({ token, serverUrl }: VoiceRoomProps) => (
  <div className={s.root}>
    <div className={s.header}>{/* ... */}</div>
  </div>
);
```

# Room session — the call outlives navigation

An active call is not tied to the `/room` route. The user can open the lobby, the admin panel or settings and the LiveKit connection stays up, collapsed into a compact bar. Only two things end it: the leave button and a page reload.

## How it used to work

`LiveKitRoom` lived inside `RoomPage`, which is to say inside `AuthedShell`'s `children`. Any `router.push` unmounted the page, LiveKit tore the connection down and fired `onDisconnected`. That handler cannot tell "the user pressed Leave" from "the component unmounted", so it called `onLeave` and redirected to the lobby. Opening settings was enough to drop out of a call.

## How it works now

The session sits above the route.

```text
AuthedProviders
└── RoomSessionProvider          entities/room/session — { session, open, close }
    └── AuthedShell
        └── .content
            ├── .page  {children}          ← the routed page
            └── RoomSessionHost            ← LiveKitRoom lives here
```

- **`entities/room/session`** holds the active session: `{ roomId, roomName, token, isDm, isInvisible }`. A plain React context, not TanStack Query — this is not server state, it has no key and no fetcher.
- **`widgets/room/room-session-host`** is the only place `LiveKitRoom` is mounted. It sits next to `{children}` in `AuthedShell`, so a route change never touches it.
- **`pages/room`** no longer owns the connection. `useRoomPage` fetches the token and calls `open(...)`; the page then renders `null`, because the host draws the room.

Expanded or collapsed is decided by `pathname === ROUTES.room`. The `isMinimized` prop on `VoiceRoom` swaps only the visual layer — `LiveKitRoom`, the microphone, deafen state and the chat panel are left untouched.

## What this changes for the code

- `onLeave` now genuinely means leaving. It arrives from `room.disconnect()`, called by the control bar, the tray menu or the collapsed bar.
- "The active room" is no longer derived from the URL. `useActiveVoiceRoomId` lives in `entities/room/session` and reads the session instead of `searchParams`.
- The token is fetched once: `useRoomToken` is disabled while a session for that room is already open.
- Leaving remembers the room. `close()` is synchronous but the `router.replace` away from `/room` is not, so for a moment the room page is still mounted, sees no session and asks for a token again — which re-opened the call collapsed. `close()` records `leftRoomId`, `open()` ignores that room, and only an explicit `rejoin()` clears it.
- On Android the connected call holds a `microphone` foreground service: `AndroidCallController` posts `start` to the shell when the room connects and `stop` when it leaves, so the call keeps working with the app in the background ([ops/google-play](../ops/google-play/README.md#backgrounded-calls)). The tray status and that notification show the room's name, which `VoiceRoom` passes to `RoomControllers` — `room.name` in LiveKit is the room id.
- Room moderation ends a call from outside. A `room.moderation` event for the open session (`removed` or `banned`) makes `RoomSessionHost` toast and run the same `leave` as the Leave button; LiveKit's own disconnect lands on that path too, whichever comes first. A ban then fails the room page's token request with `ROOM_BANNED`, which redirects to the lobby instead of showing the password form. A mute by the owner is not session state at all: it is the participant's LiveKit `canPublishSources` without `MICROPHONE`, so the mic control reads it from `useLocalParticipantPermissions` and the server enforces it even against a raw publish. A rejoin does not clear it: the server keeps the lock in memory for that room and mints the next token with the same restricted sources until the owner allows the user to speak, removes or bans them, or the room empties ([moderation](../ops/google-play/moderation.md#room-moderation)). The client reads that grant from the join token (`isTokenMicLocked`) and connects without asking for the microphone, so a locked rejoin never opens it.
- Toggling invisible mode still recreates the connection — the `` `${roomId}:${isInvisible}` `` key on `VoiceRoom` is deliberate, the server has to issue a new token.

## Boundaries

- The session lives only in the tab's memory. A reload loses it, which is intended: LiveKit tokens are short-lived, and silently rejoining a call without the user asking would surprise more than it helps.
- The provider sits inside `AuthedProviders`, so signing out unmounts it along with the rest of the tree and the connection closes with it.

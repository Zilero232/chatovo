# Invisible mode

An admin can join any voice room hidden: no password, and no *plain user* sees or hears them. It is a real hide, enforced by the server and LiveKit, not a UI trick — a plain user cannot fake it, and no plain client can reveal the hidden admin. Other admins are the one deliberate exception: they see hidden admins, marked with an "Invisible" badge.

## The security boundary

The only thing that grants invisibility is the server-verified role. The client sends an `invisible` flag, but it is meaningless on its own:

```ts
// modules/livekit/lib/resolve-invisible
resolveInvisible({ requested, isAdmin }) => Boolean(requested) && isAdmin;
```

`isAdmin` comes from the session (`session.user.role === 'admin'`), never from the request body, so a forged flag from a non-admin resolves to `false`. This is the guarantee the whole feature rests on, and it is the one thing covered by a test that must never regress.

## What the token grants

When `isInvisible` is true, `issueRoomToken` changes three things:

- **Skips the password check** — `assertRoomAccess` is not called.
- **Sets `hidden: true`** on the LiveKit grant. The SFU then keeps the participant out of everyone else's participant list.
- **Drops `canPublish` / `canPublishData`** — an invisible admin can listen but not speak, so nothing leaks through an audio track.

The token metadata also carries `invisible: true`. This is a **second** flag, separate from the LiveKit grant, and it exists only for the server's own presence layer.

## Why the metadata flag is needed

Chatovo keeps its own participant list in `presence-store`, built from two sources, and **neither is covered by LiveKit's `hidden` grant**:

1. **Webhooks** — LiveKit may still POST `participant_joined` for a hidden participant. `webhook.service` stores it with `invisible: true` and skips the join notification.
2. **`syncRoom`** — reconciles the store against `roomService.listParticipants()`, which returns hidden participants. The reconcile marks them `invisible` by either `permission.hidden` or the metadata flag.

The store therefore holds every participant, hidden ones included, and the split happens at broadcast time.

The `invisible` flag is deliberately **not** part of `participantMetadataSchema`. That schema feeds LiveKit metadata parsing; the flag reaches clients only through the admin presence snapshot described below. `isInvisibleParticipant` reads the raw JSON instead.

## Two snapshots, one store

`presence-store` builds the snapshot twice:

- `getSnapshot()` — invisible participants filtered out. A room whose only occupants are hidden admins is absent entirely, so the lobby shows it as empty.
- `getAdminSnapshot()` — the full list, each hidden admin carrying `invisible: true`.

Every realtime connection records `isAdmin`, resolved from the better-auth session at handshake (`authorizeToken`), never from anything the client sends. `sendPresenceByRole` then hands each connection the variant its own role is allowed to see. A plain user's socket never carries a hidden admin, so the hide cannot leak over the wire.

Admin counters (`admin-stats`, `admin-room`) deliberately use the public snapshot: hidden admins are observers and must not inflate room population numbers.

## What an admin sees

The room roster is drawn from LiveKit's `useParticipants`, which never returns hidden participants — so `ParticipantsView` adds the missing ones from the admin presence snapshot, rendered as `InvisibleParticipantCard` (dashed border, muted avatar, "Invisible" badge). An admin's own card comes from LiveKit as usual and gets the same badge via the `invisible` prop.

## The client side

- **The toggle** is `InvisibleModeMenuItem` (`features/app/invisible-mode`), a `DropdownMenuCheckboxItem` inside `AdminMenuButton` — the single admin entry point in the sidebar, which also holds the link to the admin panel and renders only for `isAdmin`. It lives there rather than in the settings dialog because it is an admin tool, not a user preference, and because the sidebar is reachable on web and desktop alike — the system settings tab is desktop-only. It is stored in `settings.system.invisibleMode`.
- **The token request** — `useEnterRoom` and `useRoomToken` send `invisible: isAdmin && settings.system.invisibleMode`. A non-admin never sends `true`, and even if they did the server rejects it.
- **The join/leave sounds** — `useVoiceRoomSounds` suppresses the admin's *own* join and leave chimes while invisible. Other people never hear them either, because a hidden participant emits no `ParticipantConnected` to their clients.
- **Room music is listen-only** — the server refuses a hidden admin's mutations (`addedBy` would give them away), so the music button is hidden and the minibar has no controls ([room-music.md](room-music.md)).

## Adding a surface that lists participants

The store no longer filters, so a new surface must pick its snapshot deliberately: `getSnapshot()` for anything a plain user can reach, `getAdminSnapshot()` only behind an admin check. Do not call `roomService.listParticipants()` and render the result directly — it returns hidden participants unmarked, and the hide leaks.

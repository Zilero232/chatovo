# Moderation and user-generated content

Chatovo carries user-generated content: text, files, voice, video and profiles.
Play applies its User Generated Content policy to such apps, and a build that
does not meet it is rejected or pulled after publication.

## What Play requires

The [UGC policy](https://support.google.com/googleplay/android-developer/answer/9876937)
obliges an app with UGC to ship four things:

- a content policy the user agrees to, defining what is not allowed
- an in-app way to report objectionable content and other users
- a way to block abusive users
- a moderation process that acts on those reports

Play also expects the in-app reporting flow to be reachable without leaving the
app, and the developer contact to be live.

## What the app has

| Requirement | Status |
|-------------|--------|
| Criteria of unacceptable content | Done — the "Community rules and moderation" section in `/terms` |
| Reporting mechanism | Done — "Report" in the participant and message menus |
| Blocking offenders | Done — `POST /moderation/blocks/:userId` for an admin |
| In-app user blocking | Done — "Block" in the participant menu, the profile card and the friends panel |
| Room-owner moderation | Done — remove, ban and mute in the participant menu, delete in the message menu |
| Post-moderation on reports | Done — reports reach the support mailbox and Telegram |
| Support contact | Done — `zilero@chatovo.ru` in the app and in the listing |
| Consent to the rules on signup | Done — checkbox linking `/terms` and `/privacy` |

## How it works

### Reporting

"Report" sits in the context menu of a voice room participant
([ParticipantCardMenu](../../../apps/client/web/src/widgets/room/voice-room/ui/components/ParticipantCardMenu/ParticipantCardMenu.tsx))
and of a chat message
([MessageMenuItems](../../../apps/client/web/src/widgets/chat/chat-panel/ui/components/ChatMessageItem/components/MessageMenuItems/MessageMenuItems.tsx)).
Reporting yourself or your own message is not offered.

The dialog is the
[report-abuse](../../../apps/client/web/src/features/social/report-abuse/) feature: a reason
from a fixed list (spam, harassment, hate speech, sexual content, violence,
illegal content, other) and an optional comment.

`POST /moderation/reports` writes the report to `abuse_reports`, sends mail to
`SUPPORT_EMAIL` and posts a Telegram notification. The limit is 5 reports per
minute per user, and a second report on the same target is refused while the
first one is still unhandled, so the support mailbox cannot be flooded.

The room a report belongs to is resolved server-side from the reported message
or room — never taken from the request. Reporting a message or a room the
reporter cannot access is refused with the same "not found" error as a target
that does not exist, so the endpoint cannot be used to probe for private rooms.

### Blocking

Admin role only (`assertIsAdmin`):

| Method | Path | Action |
|--------|------|--------|
| `GET` | `/moderation/reports` | Pending reports |
| `POST` | `/moderation/reports/:reportId/resolve` | Mark a report handled |
| `GET` | `/moderation/blocks` | Blocked users |
| `POST` | `/moderation/blocks/:userId` | Block, with a reason |
| `POST` | `/moderation/blocks/:userId/remove` | Unblock |

An administrator cannot be blocked, and cannot block themselves — otherwise a
single mistake could lock everyone out of moderation.

Blocking sets `user.blockedAt` and evicts the account immediately: room grants
are revoked and the WebSocket closed first, then sessions are deleted and the
participant removed from every live LiveKit room. The teardown runs under
`Promise.allSettled`, so one failing step cannot leave the account half-evicted.

Access then stays shut on every entry path — without this the flag could be
outlived by an existing session or connection:

- `BlockedUserGuard` — a global `APP_GUARD`, so every authenticated HTTP route is
  covered, including ones added later
- `LivekitService.issueRoomToken` — voice and video
- `RealtimeGateway.handleConnection` — a new WebSocket

### User-to-user blocking

Play requires one-on-one features to offer in-app blocking, separate from the
moderator ban above. Any user can block anyone they can see — from the voice
room participant menu, from the profile card (room tiles, chat authors, the
channels list) and unblock from the "Blocked" tab of the friends panel. Blocking
asks for confirmation; the blocked person is not notified.

The rows live in `user_block` (`blockerId`, `blockedId`, one per pair), served by
`BlockService` in `modules/friends`:

| Method | Path | Action |
|--------|------|--------|
| `GET` | `/friends/blocks` | Users you blocked |
| `POST` | `/friends/blocks/:userId` | Block (idempotent, never yourself) |
| `DELETE` | `/friends/blocks/:userId` | Unblock — restores nothing, not even the friendship |

What a block does:

- removes any friendship or pending request between the two, drops a call
  still ringing between them and ends a DM call already in progress — both
  identities are removed from the DM's LiveKit room
- refuses a friend request or its acceptance in either direction. The blocker
  gets `FRIEND_REQUEST_BLOCKED`; the blocked side gets exactly what an unknown
  tag (`USER_NOT_FOUND`) or a missing request (`FRIEND_REQUEST_NOT_FOUND`)
  would return. `GET /friends/relations/:userId` reports `blocked` only to the
  blocker, so the blocked side sees a stranger
- refuses DM messages and the DM voice token in either direction
  (`assertDmWithoutUserBlock`, reported as `DM_NOT_FRIENDS`), and the LiveKit
  `participant_joined` webhook removes a member who joins the DM with a token
  minted before the block — an existing DM room stays readable but no longer
  carries new messages or calls
- `GET /friends/blocks` never reports whether a blocked user is online
- on the blocker's client only: room chat messages from the blocked user collapse
  to one line with a "Show" link, and their voice is muted through the per-participant
  volume, without overwriting the user's own saved "Mute for me" choice

### Room moderation

Public rooms share one lobby, so the person who created a room has to be able to
deal with a troll in it, the way a Discord or TeamSpeak channel owner can. The
owner of a group room — and any app admin, in any group room — gets a "Room
moderation" group in the participant menu
([ParticipantModerationItems](../../../apps/client/web/src/features/room/moderate-participant/ui/ParticipantModerationItems/ParticipantModerationItems.tsx)).
It is never offered on yourself, on the room owner or on an admin (the server
refuses those with `ROOM_MODERATION_TARGET_PROTECTED`), and a DM has no moderator.

| Action | What happens |
|--------|--------------|
| Mute for everyone | The mic track is muted and `canPublishSources` loses `MICROPHONE` (camera and screen stay), so the client cannot publish it again; their mic button is locked with "Muted by the room owner". "Allow to speak" restores every source |
| Remove from the room | LiveKit `removeParticipant` — they drop back to the lobby and can come back, unmuted |
| Ban from the room | A `room_bans` row, then the same removal; the room is shut to them until the ban is lifted (below) |
| Delete a message | Any message in the room chat, not only your own — except that an owner who is not an app admin cannot delete an admin's message (`ROOM_MODERATION_TARGET_PROTECTED`) |

Remove and ban ask for confirmation. The affected person gets a `room.moderation`
realtime event (`removed`, `banned`, `muted`, `unmuted`) and a toast; removed and
banned also close their session. Remove, mute and unmute need the target to be in
the room's voice presence — otherwise they answer `USER_NOT_FOUND` and notify
nobody. A ban of someone who is not in the room is still stored, silently. The
owner sees the banned list and lifts a ban from the room's "…" menu in the
channels list.

The mute is not in the database: it is an in-memory lock (`livekit/mic-lock-store.ts`,
keyed by room and user) applied to the LiveKit participant. It survives leaving
and rejoining — the token endpoint mints the locked `canPublishSources` while the
lock is set, and the `participant_joined` webhook re-applies it to a token minted
before the mute. "Allow to speak", a removal or a ban lifts it, and it is
forgotten when the LiveKit room empties (`room_finished`) or the server restarts.
A ban is the tool for someone who keeps coming back.

A ban shuts everything in that room (app admins are exempt): the token endpoint
refuses it with `ROOM_BANNED`, and so does `assertCanAccessRoom` for chat history, sending, editing and deleting their
own messages, attachments and the room music with `ROOM_BANNED`;
`filterAccessibleRooms` leaves the room out of their realtime subscription, so
room broadcasts, reactions and presence patches stop. On the ban itself the room
is dropped from their live WebSocket subscriptions and their private-room
password grant for it is revoked, and the `participant_joined` webhook removes
them if they join with a LiveKit token minted before the ban. Room metadata
(`GET /rooms/:id`) stays readable, so the room page loads, its token request
fails with `ROOM_BANNED` and the client sends them back to the lobby.

| Method | Path | Action |
|--------|------|--------|
| `POST` | `/rooms/:roomId/participants/:userId/mute` | Lock their microphone |
| `POST` | `/rooms/:roomId/participants/:userId/unmute` | Allow them to speak |
| `POST` | `/rooms/:roomId/participants/:userId/remove` | Disconnect them |
| `POST` | `/rooms/:roomId/participants/:userId/ban` | Ban and disconnect |
| `GET` | `/rooms/:roomId/bans` | The banned list |
| `DELETE` | `/rooms/:roomId/bans/:userId` | Lift a ban |

Every route checks `assertCanModerateRoom` (owner or admin, group rooms only)
in `RoomModerationService`; the LiveKit calls go through `livekit/presence.ts`.
Bans are read through `findBannedRoomIds` (`src/lib/`), which exempts app admins
everywhere the ban is enforced.

### Community rules

The "Community rules and moderation" section in `/terms`
(`legal.termsPage.sections` in
[ru/marketing.json](../../../apps/landing/shared/i18n/locales/ru/marketing.json) and
[en/marketing.json](../../../apps/landing/shared/i18n/locales/en/marketing.json), on the
site) lists the prohibited
content, describes the reporting mechanism, post-moderation, and what a block
means.

## The admin panel

`/admin` is a route inside the web app, visible only to an account with
`role = 'admin'` — the shield button appears in the sidebar for them. It has four
tabs:

| Tab | What it does |
|-----|--------------|
| Overview | Counters (users, online, blocked, rooms, messages, open reports) and 14-day sign-up / message trends |
| Reports | Open and handled reports with the reporter, the reported user and the message text; one click marks a report handled |
| Users | Search by email, name or tag; filter by online, blocked or admin; edit the profile and role; block and unblock |
| Rooms | Search, see owner, message count and live participants; delete a room |

Every action goes through the moderation endpoints, so a block from the panel
runs the full eviction — it is never a raw database write.

The route guard is client-side (the web app is a single-page app, so there is no
middleware). It only hides the UI; the real check is `assertIsAdmin` on every
endpoint.

Roles are managed from the Users tab. The very first admin has to be promoted in
the database, since nobody can open the panel yet:

```sql
UPDATE "user" SET role = 'admin' WHERE email = 'zilero@chatovo.ru';
```

## Age rating

**16+**.

The rating must cover the worst content users can produce, not what the app
itself shows. Open voice and text chat with no pre-moderation lands on 16+; 12+
and below do not pass moderation for an app like this.

Play has no rule aimed specifically at WebRTC or voice — the general UGC and
social policy is what applies.

## What a moderator checks

- The declared rating matches the content, including what users create
- Reporting actually works
- The support contact actually works
- The app does not link to third-party app stores
- The listing describes what the app really does
- The app launches and the main flow can be walked with the test account

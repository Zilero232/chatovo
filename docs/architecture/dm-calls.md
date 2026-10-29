# Direct calls

A 1:1 voice call between friends follows the Telegram / WhatsApp model: one side rings, the other answers or declines, and **a hang-up ends the call for both**. A network drop is not a hang-up: the call waits for the person to come back. The server owns the call's state; the clients only render it.

## The state machine

`apps/server/src/modules/friends/lib/dm-call-machine` is a pure reducer: `reduceDmCall({ call, event, now })`. It holds no timers. Every timer arrives as a `tick` event and is judged against `now`, so the whole machine is tested without a clock. `nextDmCallDeadline(call)` tells the store when the next `tick` matters.

```text
ringing ──accept / callee joins the room──▶ active ──hang-up / grace over──▶ ended(completed)
   │                                          └──someone never joins──▶ ended(failed)
   ├─ decline / callee hangs up ─▶ ended(declined)
   ├─ cancel / caller hangs up / caller offline 10 s / caller starts another call ─▶ ended(cancelled)
   ├─ 45 s without an answer ─▶ ended(missed)
   └─ block or unfriend (any live state) ─▶ ended(blocked)
```

A call can also be **born** ended: `busy`, when the callee is already being rung or is ringing someone. An ended call stays visible for 4 s, so both sides can show how it ended, and is then forgotten.

| Timing                      | Value | Why                                                               |
| --------------------------- | ----- | ----------------------------------------------------------------- |
| Ring                        | 45 s  | Long enough to reach a phone in a pocket; the push expires with it |
| Caller offline while ringing | 10 s  | A refresh reconnects within it; a closed tab doesn't              |
| Join after accept           | 20 s  | Someone answered but never reached LiveKit                        |
| Peer drop grace             | 60 s  | On top of LiveKit's own ~20 s departure timeout                   |
| Ended, shown                | 4 s   | The "Call ended · 12:34" moment                                   |

They live in `friends/config/calls.ts`.

## Who is in the call

The store learns presence from LiveKit, not from the clients: the `participant_joined` / `participant_left` webhooks carry `isDm`, and `DmCallVoiceListener` feeds them to `onDmVoiceJoined` / `onDmVoiceLeft`. A leave from an active call starts the grace (`graceEndsAt`); coming back clears it. The callee joining the room while it still rings counts as an answer, so an app that only navigates still connects.

Caller reachability comes from the realtime gateway: the last socket closing calls `onCallUserOffline`, a new one `onCallUserOnline`.

## Why hang-up is explicit

A hang-up is `POST /friends/calls/:callId/hangup`, sent before the client disconnects. The webhook cannot tell a hang-up from a refresh or a crash: LiveKit reports `CLIENT_INITIATED` for a closed page too. Without the explicit call, every hang-up would look like a drop and leave the other person waiting 60 s. When a call ends, the store closes the LiveKit room (`closeLivekitRoom`), so the other side is taken out even with an old client that never hangs up itself.

## The contract

`friends.snapshot` carries `calls: { current, incoming }` — `DmCallView`s as each user sees them (`direction`, `peer`, `state`, `ringEndsAt`, `answeredAt`, `endedAt`, `endReason`, `calleeReachable`, `peerBusy`, `peerInCall`, `selfInCall`, `peerGraceEndsAt`). `current` is the user's own call (outgoing ringing, active, or just ended); `incoming` is a call ringing them, which can sit next to an active `current` (call waiting, `peerBusy` for the caller).

| Route                                  | Who        | Result                     |
| -------------------------------------- | ---------- | -------------------------- |
| `POST /friends/:userId/calls`          | caller     | `DmCallView` (glare → active) |
| `POST /friends/calls/:callId/accept`   | callee     | `DmCallView`; ends the callee's other active call |
| `POST /friends/calls/:callId/decline`  | callee     | 204                        |
| `POST /friends/calls/:callId/cancel`   | caller     | 204                        |
| `POST /friends/calls/:callId/hangup`   | either     | 204                        |

`CALL_NOT_FOUND` for an unknown call or the wrong side, `CALL_ENDED` for a call that is over.

### Older installed apps

Desktop and Android bundle the web client, so an installed app can be a release behind. The snapshot keeps the old `incoming` / `outgoing` fields with the **old** status enum (a new value would make an old client drop the whole snapshot), and the old routes stay: `POST /friends/:userId/call` (returns the room), `calls/accept|decline|cancel|ack`, `GET calls/incoming|outgoing`. They map onto the same machine. Remove them once no supported app uses them.

## What an ended call leaves behind

`CallEnded` is a domain event. The chat module writes a call row into the DM chat (`messages.kind = 'call'`, outcome and duration in `messages.call`, an English `body` for clients that predate call rows); it can't be edited or deleted (`MESSAGE_NOT_EDITABLE`), and a block leaves no row. The push listener replaces the incoming-call notification with a missed-call one for `missed`, `cancelled` and `busy`, under the same FCM `tag` (the call id). Call pushes are localized by the device's `locale`, and the ringing push has a 45 s `ttl` so a late delivery never rings after the call is over.

## Privacy

DM rooms never appear in the public or staff presence snapshot: `markDmRoom` flags them from the webhook (and from `syncRoom` after a restart), and `presenceForViewer` adds a DM room only to the sockets of its two members. The DM voice token requires the two to still be friends (`assertDmFriends`), so a former friend can't join by the room link.

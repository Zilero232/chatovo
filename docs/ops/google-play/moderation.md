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
| Post-moderation on reports | Done — reports reach the support mailbox and Telegram |
| Support contact | Done — `zilero@chatovo.ru` in the app and in the listing |
| Consent to the rules on signup | Done — checkbox linking `/terms` and `/privacy` |

## How it works

### Reporting

"Report" sits in the context menu of a voice room participant
([ParticipantCardMenu](../../../apps/web/widgets/room/voice-room/ui/components/ParticipantCardMenu/ParticipantCardMenu.tsx))
and of a chat message
([MessageMenuItems](../../../apps/web/widgets/chat/chat-panel/ui/components/ChatMessageItem/components/MessageMenuItems/MessageMenuItems.tsx)).
Reporting yourself or your own message is not offered.

The dialog is the
[report-abuse](../../../apps/web/features/social/report-abuse/) feature: a reason
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

### Community rules

The "Community rules and moderation" section in `/terms`
(`legal.termsPage.sections` in
[ru/marketing.json](../../../apps/site/shared/i18n/locales/ru/marketing.json) and
[en/marketing.json](../../../apps/site/shared/i18n/locales/en/marketing.json), on the
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

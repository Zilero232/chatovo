# Personal data

What Chatovo collects, why, and who it is shared with. Fill the Play Console's
Data safety form from this, and answer a reviewer from it.

## Play requirements

[Data safety](https://support.google.com/googleplay/android-developer/answer/10787469):

| Requirement | Status |
|-------------|--------|
| Privacy policy URL | Done — `https://chatovo.ru/privacy` |
| User informed about collection | Done — the `/privacy` page |
| User consent to collection | Done — checkbox linking `/terms` and `/privacy` in the sign-up form |
| No selling of collected data | Data is never sold or handed to advertisers |
| Encryption in transit | Done — HTTPS / WSS |
| In-app account deletion | Done — Settings → Security → Delete account |
| Web account deletion URL | Done — `https://app.chatovo.ru/account/delete` |

Play requires **both** deletion paths for an app with accounts: one inside the
app and one reachable on the web without installing it. The page lives on the
app host, where the session is; the old `https://chatovo.ru/account/delete`
301s there. The privacy policy stays on the site and answers 200 directly. See
[moderation.md](moderation.md) for the UGC side.

## What is collected

### Account

| Type | Required | Purpose |
|------|----------|---------|
| Email | Required | Sign-in, account recovery, transactional mail |
| Name / display name | Required | Identity in rooms |
| User id | Required | Running the service |
| Password | Required | Stored as a hash, never in plain text |

### Profile

| Type | Required | Purpose |
|------|----------|---------|
| Avatar | Optional | Shown in rooms |
| Bio, banner colour, link | Optional | Profile presentation |

### Communication

| Type | Required | Purpose |
|------|----------|---------|
| Text messages | On user action | Room chat and direct messages |
| Files and images | On user action | Chat attachments |
| Voice | On user action | Voice rooms — relayed in real time, never recorded or stored |
| Video | On user action | Video and screen share — relayed in real time, never recorded or stored |

### Technical data

| Type | Required | Purpose |
|------|----------|---------|
| User agent, session time and IP | Automatic | Security, the active sessions list, incident analysis |
| Device push token | When notifications are enabled | Delivering call and message notifications |
| In-app activity | Automatic | Room presence, online status |

## Android permissions

| Permission | Requested when | Required |
|------------|----------------|----------|
| `RECORD_AUDIO` | Joining a voice room | Optional — text chat works without it |
| `CAMERA` | Turning the camera on | Optional |
| `MODIFY_AUDIO_SETTINGS` | Alongside the microphone | Optional |
| `POST_NOTIFICATIONS` | On first launch | Optional |

No permission is requested at startup without a user action.

## Sharing with third parties

| Recipient | What is shared | Why |
|-----------|----------------|-----|
| LiveKit (self-hosted SFU) | Voice, video, data channels | Real-time media relay |
| SMTP provider | Email address | Address verification, password reset |
| Firebase Cloud Messaging (Google) | Push token, notification title | Push delivery on Android |
| Google Play | Install and update events | App distribution |

Nothing is shared with ad networks or third-party analytics: the app carries no
advertising.

## Retention

| Data | Retained for |
|------|--------------|
| Account and profile | While the account is active |
| Messages and attachments | Until deleted by the user or with the account |
| Session logs | A limited period needed for security |
| Voice and video | Not stored — relayed only |

## Deletion

Self-service, from Settings → Security → Delete account, or from
`https://app.chatovo.ru/account/delete`. better-auth emails a confirmation link;
following it deletes the account.

Removed: the profile, the avatar files on disk, the rooms the user created,
friendships, and push devices. Messages in shared rooms are kept with a null
sender, so other people's conversations stay readable — the author's name is
gone from them. Backups roll over within 30 days.

## Other declarations

| Declaration | Answer |
|-------------|--------|
| Advertising | No |
| In-app purchases | No |
| User-generated content | Yes — chat, profiles, voice |
| Age rating | 16+ |
| Independent security audit | Not performed |

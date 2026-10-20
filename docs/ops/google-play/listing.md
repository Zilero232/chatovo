# Store listing

Copy and asset requirements for the Play Console. Limits come from Play's
[store listing requirements](https://support.google.com/googleplay/android-developer/answer/9859455).

The app must offer Russian or English (Chatovo ships both plus a switcher) —
otherwise publication is declined.

## Name

Chatovo

The console caps the name at 30 characters; the API field `appName` allows 50.

## App type

`MAIN` (not a game).

## Category

Communication (at most 2 categories).

## Short description (80 characters max)

**RU:** Голосовые и видео-комнаты в реальном времени

**EN:** Real-time voice and video rooms

## Full description (4000 characters max, collapsed at 2000 in the UI)

```text
Chatovo — мессенджер с голосовыми и видео-комнатами в реальном времени.

Создайте комнату в один клик, отправьте ссылку друзьям и начинайте разговор.
Без громоздких списков серверов — только комнаты.

Возможности:
• Голосовые и видео-комнаты с низкой задержкой (WebRTC)
• Публичные и приватные комнаты с паролем
• Текстовый чат с вложениями
• Профиль: аватар, описание, ссылка
• Вход по email
• Интерфейс на русском и английском

Правила сообщества и жалобы на контент — в разделе «Условия использования»
внутри приложения. Пожаловаться на пользователя или сообщение можно прямо в
комнате, а также письмом на zilero@chatovo.ru.

Поддержка: zilero@chatovo.ru
Политика конфиденциальности: https://chatovo.ru/privacy
```

## Full description — EN

```text
Chatovo is a real-time messenger built around voice and video rooms.

Create a room in one click, share the link, and start talking. No cluttered
server lists — just rooms.

Features:
• Low-latency voice & video rooms (WebRTC)
• Public and password-protected private rooms
• Text chat with file attachments
• Profile: avatar, bio, external link
• Sign in with email
• English and Russian UI

Community rules and content reporting live under "Terms of Service" inside the
app. You can report a user or a message straight from a room, or write to
zilero@chatovo.ru.

Support: zilero@chatovo.ru
Privacy: https://chatovo.ru/privacy
```

## Age rating

**16+**

Play uses an IARC questionnaire instead of a fixed scale; a UGC chat app with no purchases lands on Teen / 16+.

Rationale: user-generated content with no pre-moderation — text, voice, video and
files. The rating has to cover the worst content users can produce, so 12+ and
below do not pass for an open voice chat. Details in
[moderation.md](moderation.md).

## Developer contacts

| Field | Value |
|-------|-------|
| email | `zilero@chatovo.ru` |
| website | `https://chatovo.ru` |
| vkCommunity | — |
| maxMessenger | — |

## What's new (5000 characters max)

**RU:** Первый релиз для Android — голосовые комнаты, чат, вход по email.

**EN:** Initial Android release — voice rooms, text chat, email sign-in.

For every later version the text is taken from the GitHub Release body and
passed as `whatsNew` when the draft is created.

## Note to the moderator (180 characters max)

```text
Тестовый аккаунт и шаги проверки — в описании версии. Микрофон нужен только для
голосовых комнат, запрашивается по действию пользователя.
```

## Graphics

Everything below lives in [assets/](assets/), ready to upload.

| Asset | Requirements | In the repo |
|-------|--------------|-------------|
| Icon | 512×512, **32-bit PNG with alpha**, up to 1 MB | `assets/icon-512.png` (coral plaque, regenerated with the brand recolour) |
| Feature graphic | 1024×500, **24-bit PNG or JPEG, no alpha** — mandatory, the listing cannot publish without it | `assets/feature-graphic.png` (regenerated with the brand recolour) |
| Phone screenshots | 2–8, **24-bit PNG or JPEG, no alpha**, each side 320–3840 px, the long side at most twice the short one | `assets/screenshots/` |
| Tablet screenshots | 4 each for 7-inch and 10-inch, only if the app is distributed to tablets | — |
| Video | a YouTube link, optional | — |

Note the two formats pull in opposite directions: the icon **needs** an alpha
channel, the screenshots and the feature graphic **must not** have one. A
32-bit screenshot is rejected on upload.

Play recommends at least 4 phone screenshots at 1080 px or more on the short
side for the app to qualify for promotional placement.

**How the current set was shot.** Playwright against a production export
(`next build`; the dev build adds the Next and React Query badges), in a
360×640 viewport at `deviceScaleFactor: 3`, which is exactly 1080×1920 and 16:9,
so the 2:1 limit never bites. The data is a throwaway database seeded through
the API — six demo accounts who are friends, a few rooms, a direct conversation
with an image and a link, a room chat — and the friends are joined to the voice
room from extra browser contexts started with
`--use-fake-device-for-media-stream`. Run the API, LiveKit and the export on
their own ports so a running `bun dev` is left alone. Room names are ASCII only
(the schema refuses Cyrillic).

Screens, in this order: friends online, a direct chat, the voice room, the room
chat, the rooms drawer. The UI is in Russian, the market the listing targets.

The shots come out RGBA; flatten them to RGB before uploading
(`sharp(...).flatten().removeAlpha()`), and `check-assets.py` catches it if you
forget.

An emulator works too: `adb shell wm size 1080x1920` and `adb shell wm density
420` on any AVD, then `adb exec-out screencap -p`. A modern tall phone at its
native 1080×2400 fails the 2:1 rule.

Verify before uploading:

```bash
cd docs/ops/google-play/assets && python check-assets.py
```

## FAQ (optional)

Up to 10 question/answer pairs: question up to 120 characters, answer up to 500.

## Price

The app is free — leave `priceValue` empty.

## Publication

`publishType: MANUAL` — once moderation passes, the version is published by hand
from the console. The CI upload creates a draft and submits it for review, but
never releases it to users.

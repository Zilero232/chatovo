# Google Play — Chatovo

Checklist and copy-paste material for publishing the Android app `chatovo.app`
to Google Play.

Play is the only store the app ships to. The desktop installers on GitHub
Releases are unrelated to it.

## Status in the repo

| Item | Status |
|------|--------|
| Privacy policy `/privacy` | Done (site, `https://chatovo.ru/privacy`) |
| Terms `/terms` | Done (site, `https://chatovo.ru/terms`) |
| Android Tauri config | Done (`tauri.android.conf.json`) |
| Mobile capability | Done (`capabilities/mobile.json`) |
| Android mic/camera manifest | Done (`build.rs` → `tauri_utils::build::update_android_manifest`) |
| Desktop-only UI gated | Done (`isTauriDesktop()`) |
| CORS for the Android WebView | Done (`http(s)://localhost`) |
| `gen/android/` project | `bun android:init` locally / in CI (gitignored) |
| Upload key | Required — see [signing.md](signing.md) |
| In-app account deletion | Done (Settings → Security → Delete account) |
| Web account deletion page | Done (`https://app.chatovo.ru/account/delete`) |
| Community rules in `/terms` | Done (site, both locales) |
| Report a user / a message | Done (`features/social/report-abuse`) |
| Blocking offenders | Done (`modules/moderation` on the server) |
| Consent checkbox on signup | Done (sign-up form) |
| Admin panel | Done (`/admin`, four tabs — see [moderation.md](moderation.md)) |
| Store listing | See [listing.md](listing.md) |
| Icon + feature graphic | Done (`assets/`, regenerated for the violet brand plaque) |
| Phone screenshots | Done (`assets/screenshots/`, five 1080×1920 shots) |
| Data safety form | See [data-safety.md](data-safety.md) |
| Moderation and UGC | See [moderation.md](moderation.md) |
| Foreground service for calls | Done — see [Backgrounded calls](#backgrounded-calls); declare it in the Console before the first upload |
| 16 KB memory pages | Done — 64-bit only, see [ABIs](#abis) |
| Automated Play upload | Done — `release.yml` uploads the aab once `PLAY_SERVICE_ACCOUNT_JSON` is set, see [release.md](../release.md#google-play-upload) |

## ABIs

Both the CI job and `bun android:build` build `aarch64` and `x86_64` only.

32-bit Rust output (`armeabi-v7a`, `x86`) links its `LOAD` segments at a 4 KB
alignment, which Play flags: devices with 16 KB memory pages — Pixel 9 and
newer — may fail to install or crash. The 64-bit targets already come out at
`0x4000`, so dropping the 32-bit ones clears the warning and halves the bundle.
Play has required 64-bit support since 2019, and `x86` only ever served
emulators.

Check a built library with:

```bash
llvm-readelf -l <lib>.so | grep -A1 LOAD   # want 0x4000, not 0x1000
```

## Commands

```bash
# One-time: Android Studio + SDK/NDK, rust android targets
bun android:init

# Dev on a device/emulator
bun android:dev

# Release build (APK + AAB)
bun android:build
# Output: apps/client/native/gen/android/app/build/outputs/bundle/universalRelease/app-universal-release.aab
```

## CI (GitHub Actions)

| Workflow | Trigger | Contents |
|----------|---------|----------|
| `release.yml` | push a `v*` tag | `vX.Y.Z` — desktop installers (Windows, macOS arm64 + x64, Linux) and the signed Android AAB |
| `deploy.yml` | manual run | Web, site and API images to GHCR, then the VPS stack (no GitHub Release) |

Job `android` builds and signs the bundle, attaches it to the draft release and
uploads it to the Play track in `PLAY_TRACK` (production by default), sent for
review. The service account setup is in
[release.md](../release.md#google-play-upload).

## Environment

`apps/client/native/.env` (copy of `.env.example`) — read by every `android:*` script:

```env
JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
ANDROID_HOME=C:\Users\<you>\AppData\Local\Android\Sdk
NDK_HOME=C:\Users\<you>\AppData\Local\Android\Sdk\ndk\<version>
```

Install the NDK from Android Studio → SDK Manager, then point `NDK_HOME` at the
folder under `ndk\`.

Required SDK Tools (SDK Manager → SDK Tools tab):

- **Android SDK Command-line Tools (latest)** — without it `tauri android init` fails
- NDK (Side by side)
- Android SDK Build-Tools
- Android SDK Platform-Tools
- At least one Android SDK Platform (API 34+)

Verify after install:

```bat
dir "%LOCALAPPDATA%\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat"
dir "%LOCALAPPDATA%\Android\Sdk\ndk"
```

```bash
rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android
```

## Backgrounded calls

Since Android 11 a backgrounded process without a `microphone` foreground service
records silence, so a call needs one to survive switching apps or locking the
screen. The pieces:

- `apps/client/native/android/CallService.kt` — the foreground service
  (`foregroundServiceType="microphone"`) with an ongoing-call notification; tapping
  it brings the app back. It refuses quietly (Android 14 without `RECORD_AUDIO`, or a
  start from the background) and the call simply keeps working in the foreground.
  A stop is an `ACTION_STOP` intent through the same `startForegroundService`, not
  `stopService`: a service stopped before it reaches `startForeground` crashes the
  app, and a leave right after a join does exactly that.
- `android/res/drawable/ic_call_notification.xml` — the status bar icon, the brand
  mark as a white silhouette; the launcher icon would show as a white blob there.
- `CallBridge.kt` + `MainActivity.onWebViewCreate` — `window.chatovoCall.postMessage`
  from the web app, through `WebViewCompat.addWebMessageListener`. The object is
  injected only on the app's origin (`http(s)://tauri.localhost`, which
  `android:dev` uses too), only the main frame is heard, and a non-string message
  is dropped.
- `build.rs` — `FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_MICROPHONE` and the
  `<service>` entry, injected like the other manifest blocks.
- `scripts/setup-android-fcm.mjs` copies every `android/*.kt` and `android/res/`
  into `gen/android` after `tauri android init`, the same overlay MainActivity
  already used.
- The web app starts the service once a room connects, keeps it through
  reconnects (a network switch must not drop the microphone) and stops it on
  disconnect or leave (`widgets/room/voice-room/ui/controllers/AndroidCallController`);
  the notification text is translated.

**Play Console: declare the foreground service type before uploading a build that
contains it.** App content → Foreground service permissions → `FOREGROUND_SERVICE_MICROPHONE`:
"Voice calls in rooms continue while the app is in the background; the service runs
only while the user is in a call and shows an ongoing notification." Play asks for a
short video of the flow (join a room, switch to another app, keep talking, the
notification, leave). Without the declaration the release is held in review.

Not verified on a device from this repo's CI — check on a phone after the first
build: join, background the app, talk, look for the notification, leave.

## In-app updates

There are none on Android, by design. Play forbids an app updating itself around
the store, so the Tauri updater is excluded from Android at three layers: the
dependency is behind `cfg(not(android))` in `Cargo.toml`, the plugin is
registered under `#[cfg(desktop)]` in `lib.rs`, and `updater:default` only
appears in `capabilities/desktop.json`. The client hook is gated on
`isTauriDesktop()` on top of that.

Play updates the app itself. If a forced-update screen is ever wanted, the
supported route is Play's own `AppUpdateManager` (`com.google.android.play:app-update`),
which would need a Tauri plugin wrapping it — nothing like that exists today.

## Push notifications

Push runs on Firebase Cloud Messaging, which is the native transport for a Play
build: every device that can install from Play has Google services.

### Firebase Console

1. Create a Firebase project (or reuse an existing one).
2. Add an Android app with the package `chatovo.app`.
3. Download `google-services.json`.
4. Project settings → Service accounts → Generate new private key → keep the JSON for the server.

### Android app

`gen/android/` is gitignored and regenerated by `tauri android init`. Do **not**
edit it by hand.

1. Download `google-services.json` from the Firebase Console (Android app `chatovo.app`).
2. Save it to **`apps/client/native/android/google-services.json`** (committed — not a secret).
3. Run any android script — `setup-android-fcm.mjs` copies the file and the `MainActivity.kt` overlay into `gen/android/app/` and patches Gradle.

`POST_NOTIFICATIONS` is injected through `build.rs` on every build. Plugin
permission: `fcm:default` in `capabilities/mobile.json`.

### Server

Set `FIREBASE_SERVICE_ACCOUNT` in the root `.env` to the service account JSON on
a single line. Without it the server logs `push notifications are disabled` at
the first send and nothing reaches the phone.

### When a push is sent

- A direct message, unless one of the recipient's realtime connections is
  **active**. Every client reports `client.activity` over the socket: active
  means the page is visible and the window focused. An open but backgrounded
  app — Android keeps the WebView and its socket alive — counts as away, so the
  phone still gets the push. Desktop in the tray or an unfocused tab do too.
- An incoming call, always.

### Tapping a push

Every payload carries a `link` data field, built by `PUSH_LINKS` in
`@chatovo/schemas`: `chatovo://lobby?chat=<friendId>` for a message,
`chatovo://lobby` for a call (the ringing dialog comes from the realtime
snapshot). Android hands the data fields to the launched activity as extras;
`android/MainActivity.kt` turns `link` into a VIEW intent, the deep-link plugin
delivers it, and `DeepLinkProvider` navigates. `FriendChatLinkOpener` on the
lobby opens the chat named by `?chat=`.

## Before the first submission

1. Google Play developer account registered and identity-verified ($25, one-off)
2. App `Chatovo` created with the package `chatovo.app` — **the package name is permanent once published**
3. Play App Signing enrolled and the upload key registered — see [signing.md](signing.md)
4. Privacy policy URL filled in: `https://chatovo.ru/privacy`
5. Data safety form completed from [data-safety.md](data-safety.md)
6. Account deletion URL filled in: `https://app.chatovo.ru/account/delete` (the `chatovo.ru` path 301s there; give Play the final URL)
7. Support mailbox `zilero@chatovo.ru` reachable
8. Reviewer credentials filled into the Play Console's *App access* section — **not** committed to this repo
9. At least one account holding the `admin` role — promote the first one in the database, the rest from the Users tab: [moderation.md](moderation.md)
10. Database migrated: `bun db:deploy` from `apps/server/`

## Package identifiers

| Platform | Identifier |
|----------|------------|
| Desktop | `chatovo.desktop` |
| Android | `chatovo.app` |

## Version code

Tauri derives it from the root `package.json` version:
`major * 1000000 + minor * 1000 + patch`. Version `1.4.3` → `versionCode = 1004003`.

Play rejects an upload whose `versionCode` is not strictly higher than any
previous one — including one that was uploaded and then discarded. A botched
upload therefore costs a patch bump.

Override it in the config when that is not enough:

```json
"bundle": { "android": { "versionCode": 1004003 } }
```

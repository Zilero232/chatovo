# CLAUDE.md — apps/tauri

Guidance for Claude Code when working in the desktop shell. Extends the root [../../CLAUDE.md](../../CLAUDE.md); those rules still apply. The digest in `.claude/rules/tauri/` loads automatically when you edit files here; the client side of Tauri is [docs/guides/client/tauri.md](../../docs/guides/client/tauri.md).

Desktop shell — **Tauri 2 (Rust)**. Wraps the same Vite web app ([apps/web](../web/)) in a native window — not the public site; no separate UI lives here.

## Layout

```
src/
├── main.rs           # binary entry — calls lib::run()
├── lib.rs            # Tauri builder: registers plugins, deep-link scheme, single-instance
├── tray_menu.rs      # the native tray icon + menu (docs/architecture/tray-menu.md)
├── webview_lockdown.rs # Windows release builds: WebView2 browser shortcuts off (reload, print, devtools)
└── game_detection/   # "Playing X", games only: Steam/Epic/GOG + Windows Game Bar list (docs/architecture/game-activity.md)
capabilities/         # permission sets granted to the webview
icons/                # generated — source: icon.manifest.json + apps/web/app/app-icon*.svg
tauri.conf.json       # config — frontendDist points at the built client, bundle/updater settings
Cargo.toml            # Rust deps (tauri + plugins)
```

## How it relates to the client

- The window loads the client build via `tauri.conf.json` → `frontendDist` (`../web/dist`); in dev, `devUrl` is the Vite dev server on :3000.
- **Desktop-only features** (system tray, global shortcuts, deep links, updater) are implemented on the JS side in [apps/web/features/app/](../web/features/app/) using `@tauri-apps/api` + plugin packages. The exception is the **system tray**: a JS-created tray loses its click handler when React remounts, so the icon and its native menu are built in [src/tray_menu.rs](src/tray_menu.rs) at startup and the frontend only pushes labels and state — see [docs/architecture/tray-menu.md](../../docs/architecture/tray-menu.md).
- Every Tauri call on the client **must** be gated with `isTauri()` so the web build keeps working (`isTauri()` is false in the browser).
- Native plugins enabled here (see [src/lib.rs](src/lib.rs)): global-shortcut, updater, os, single-instance, opener, process, deep-link. The `chatovo://` deep-link scheme is registered at runtime in dev (installers handle it in prod).

## Commands (from repo root)

```bash
bun tauri:dev          # run the desktop dev shell
bun tauri:build        # produce a native binary
bun android:init # init Android project (requires SDK + NDK)
bun android:dev  # run on Android device/emulator
bun android:build # build the APK + the Play AAB
```

The Rust toolchain (version, rustfmt, clippy) is pinned in the root [mise.toml](../../mise.toml) — `mise install`; there is no `rust-toolchain.toml`. `bun lint:rust` and `bun format:rust` run from the root.

Releases are built by `.github/workflows/release.yml` on a `v*` tag ([docs/ops/release.md](../../docs/ops/release.md)) — desktop
via `tauri-action` (Windows, macOS arm64 + x64, Linux), Android signed by
`scripts/android-signing.mjs` from the `ANDROID_KEY_*` secrets. The local
commands above are for development.

Android setup: install Android Studio (SDK + NDK), copy `apps/tauri/.env.example` → `.env`, set `NDK_HOME` (and `JAVA_HOME`, usually Android Studio's bundled JBR) to your installed folders, then `bun android:init`. See [docs/ops/google-play/README.md](../../docs/ops/google-play/README.md).

**WebRTC (mic/camera):** `build.rs` calls `tauri_utils::build::update_android_manifest` (same API Tauri plugins use) to inject `RECORD_AUDIO`, `CAMERA`, and `MODIFY_AUDIO_SETTINGS` into `gen/android/.../AndroidManifest.xml` on Android builds. Without these, `getUserMedia` fails on Android — `RustWebChromeClient` can only show the OS prompt when permissions are declared in the manifest.

**Gradle wiring:** everything Android needs on top of the Tauri template is patched into the regenerated `gen/android/` by the two scripts below. `[package.metadata.cargo-android]` looks like the declarative way to do it, but it reaches the template only on the very first `android init` — `tauri android build` re-renders the build files without it, and the build then fails on `Unresolved reference` for anything declared that way. The patches anchor on block structure (`buildscript { … dependencies {`, `id("rust")`) rather than on a version string, so a Tauri bump does not silently skip them.

**FCM (push):** `google-services.json` lives in `android/` (committed). `scripts/setup-android-fcm.mjs` runs before every `android:*` build, copies it and the `android/MainActivity.kt` overlay (push tap → deep link) into `gen/android/app/` and applies the Google Services Gradle plugin — `gen/` is gitignored and must not be edited by hand. FCM is the only push transport; devices with no Google mobile services get no push.

**In-app updates on Android:** none, by design — Play forbids an app updating itself around the store. The Tauri updater is excluded at three layers: the dependency is behind `cfg(not(android))` in `Cargo.toml`, the plugin is registered under `#[cfg(desktop)]` in `lib.rs`, and `updater:default` only appears in `capabilities/desktop.json`. The client hook is gated on `isTauriDesktop()` on top of that.

**Android dev:** `bun dev:server` + `bun android:dev`. The WebView loads the page from `tauri.localhost`, so a dev-only inline shim (`getTauriMobileHmrShim`, injected into `index.html` by `apps/web/vite.config.ts`) points Vite's HMR socket at the host.

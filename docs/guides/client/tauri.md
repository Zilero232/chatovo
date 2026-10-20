# Tauri on the client

The desktop and Android apps load this same client in a Tauri webview. Desktop-only features (system tray, global shortcuts, deep links, the updater, window controls) are written on the JS side with `@tauri-apps/api` and the plugin packages; the Rust shell is described in [apps/client/native/CLAUDE.md](../../../apps/client/native/CLAUDE.md).

## Gate every call

Every Tauri call is behind `isTauri()` (from `@tauri-apps/api/core`), so the web build keeps working, where `isTauri()` is `false`. Narrow it further when a feature is platform-specific:

- `isTauriDesktop()` / `isTauriMobile()` from `shared/lib/tauri-platform`. The updater, the tray and global shortcuts are desktop-only; Android has no in-app updates, by Play policy.
- `useIsTauriDesktop()` from `shared/hooks` inside components.

Never import a Tauri plugin at module scope in code the web build renders unconditionally. Load it inside the gated branch or the effect.

## The tray belongs to Rust

A JS-created tray loses its click handler when React remounts, so the icon and its native menu are built in Rust at startup and the client only pushes labels and state — [architecture/tray-menu.md](../../architecture/tray-menu.md).

## The start URL

`tauri.conf.json` opens `/lobby` directly. An `isTauri()` redirect on the landing page would be dead code.

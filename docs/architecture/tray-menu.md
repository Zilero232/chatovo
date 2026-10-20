# Tray menu

The desktop tray uses the **native context menu**, built in Rust. The whole thing lives in [apps/tauri/src/tray_menu.rs](../../apps/tauri/src/tray_menu.rs); the frontend only supplies translated labels and the current room state.

## Pieces

| Where | What it does |
| --- | --- |
| [apps/tauri/src/tray_menu.rs](../../apps/tauri/src/tray_menu.rs) | Builds the icon and its menu at startup, handles clicks, exposes `update_tray_labels` / `update_tray_state` |
| `features/app/system-tray/api/tray-state.ts` | The `invoke` wrappers and the `tray:action` listener — an I/O boundary, hence `api/` rather than `model/` |
| `features/app/system-tray/model/hooks/use-tray-bridge/` | Pushes state on change, forwards actions back to the room |
| `app/providers/TrayMenuProvider.tsx` | Sends the localized labels once the locale is known |
| `widgets/room/voice-room/.../RoomTrayController` | Derives the state (status line, mute, deafen) and acts on incoming actions |

## Why the tray is built in Rust

Two attempts failed before this one, and both failures are worth remembering.

**A JS-created tray loses its click handler.** `TrayIcon.new({ action })` binds the callback to the webview that created it. `AppProviders` is mounted separately in each route group, so navigating from `/auth` to `/lobby` unmounts the tree and silently kills the handler — the icon stays, the clicks stop.

**A webview popup deadlocks on Windows.** The custom-window version opened a frameless webview from the tray's click handler. From the Tauri docs:

> On Windows, this function can deadlock when used in a synchronous command and event handlers.

WebView2 blocks the thread owning the event loop, so the call never returns. Building the window up-front avoided the deadlock but the popup still never became visible, and the native menu turned out to be both simpler and reliable.

**What was given up:** Windows does not let an application style its native context menu — background, font, corner radius and spacing all come from the OS. Emoji in labels render as monochrome glyphs, so labels stay plain text.

## Startup order

The menu is built during `setup()` with **English defaults**, before any webview exists — this is what makes it independent of React. The frontend then calls `update_tray_labels` once `use-intl` resolves the locale, and `update_tray_state` on every state change.

Items that change (`status`, `mute`, `deafen`, `leave`) are kept in a `static Mutex<Option<TrayItems>>`, because a `Menu` cannot be queried for its children after construction.

## Actions

Menu clicks are handled two ways:

- **Shell-level** (`Open Chatovo`, `Quit`) act on the window or the app directly in Rust — they must work with no webview mounted.
- **Room-level** (`toggleMute`, `toggleDeafen`, `leaveRoom`, `checkUpdates`) are emitted as a `tray:action` event and handled by `RoomTrayController`, which sits inside the LiveKit room context.

Left click toggles the main window; right click opens the menu (`show_menu_on_left_click(false)`).

## Adding an item

1. Add its id constant and a `MenuItem` in `build()` in `tray_menu.rs`.
2. Map the id in `on_menu_event` — either act in Rust or emit an action.
3. If it is a room action, add it to `TrayAction` in `api/tray-state.ts` and to the `match` in `RoomTrayController`; `.exhaustive()` points at the gap.
4. Add the label to `TrayLabels` (both Rust and TS), to `tray.*` in both locale files, and to the `localizeTray` call in `TrayMenuProvider`.

## Gotchas

- **The tray survives a webview reload; a JS-side handler does not.** Anything that must work regardless of the app's state belongs in Rust.
- **Rust changes need a real rebuild.** A running `chatovo.exe` holds the binary and `cargo build` fails with an access-denied error (localized by Windows, so the wording depends on the system language) — it is easy to miss in a long log, and the old binary keeps running. Close the app first (`bunx fkill chatovo.exe`).
- **Labels are not reactive.** Changing the locale at runtime requires another `update_tray_labels` call; nothing pushes it automatically.

---
paths:
  - 'apps/web/**/*.{ts,tsx}'
---

<!-- Compressed editing rules, loaded automatically when a client file is edited. -->
<!-- The full reasoning is docs/guides/client/tauri.md; keep them in sync. -->

# Client — Tauri

Every Tauri call is behind `isTauri()` so the web build keeps working; desktop-only features (updater, tray, global shortcuts) behind `isTauriDesktop()` / `useIsTauriDesktop()`. No Tauri plugin import at module scope in code the web build renders unconditionally. The tray icon and menu are owned by Rust — the client only pushes labels and state.

A room is `/room?id=…` (`buildRoomHref`, `buildRoomSearch`), never `/room/<id>` — invite links in the wild use the query form.

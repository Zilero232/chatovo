# Game activity — "playing X" next to a participant

A participant can share the name of the game they have running — games only, never ordinary programs. Other people in the room see it under their name. It is opt-in, it can be turned off, and it only works in the desktop app — a browser cannot inspect the process list.

## Where each piece lives

```text
apps/tauri/src/game_detection/     Rust — resolves a running process to a display name
apps/web/src/features/app/game-activity/
├── api/detect-running-game.ts     invoke('detect_running_game'), null outside the desktop shell
├── model/hooks/use-game-activity      polls via TanStack Query, gated on the setting
└── model/hooks/use-game-activity-sync publishes the result into presence
```

The detected name travels the same path as mute and deafen state: a `presence.patch` message over the app WebSocket, into the in-memory presence store, back out to every subscriber in the room snapshot.

## Detection: only what the machine knows as a game

There is no public catalogue mapping an executable to a game title, so nothing is hardcoded — and a program's own metadata can't tell a game from Blender or VS Code. Detection is therefore inclusion-based: a process counts only when one of the sources on this machine knows it as a game. They are merged into one index of install folders (`game_detection/index.rs`), rebuilt at most every five minutes:

1. **Steam** — every `appmanifest_<appid>.acf`, resolved to the app's install folder. Steam executables are often generically named, so the folder is the key and the manifest `name` is the title.
2. **Epic Games** — the launcher's `*.item` manifests (`DisplayName`, `InstallLocation`), only those in the `games` category, which leaves out the Unreal Engine and other tools.
3. **GOG Galaxy** — the `GOG.com\Games` registry key (`gameName`, `path`). Windows only.
4. **Windows Game Bar** — `HKCU\System\GameConfigStore\Children\*\MatchedExeFullPath`, the executables Windows itself recognised as games (what drives Game Mode). It covers Battle.net, Riot, EA, Xbox PC and standalone titles that no launcher manifest describes. These are named from the executable's `FileDescription` / `ProductName`, falling back to the file name.

An executable matches the deepest install folder that contains it; a folder shallower than two segments (a drive root) is refused so it can't swallow every program. Nothing matched means no activity is published.

Among the processes that match, the **most recently started** wins. A wallpaper tool has been running since boot while the game the user just launched is minutes old, so ranking by longest-running would report the wallpaper forever.

The exclusion filter stays in front of the index as a safety net: system directories, `WindowsApps`, helpers, updaters, launchers and always-on tools are dropped before a process is looked up — Wallpaper Engine, for one, is installed through Steam. A process must also have been alive for at least 30 seconds, which keeps the status from flickering.

## Privacy

- Off is one switch away, in Settings → System. The toggle only appears on desktop.
- Only the resolved display name leaves the machine — never a path, never a command line, never a process list.
- The name is capped at 64 characters by the schema and is never persisted: it lives in the presence store and disappears when the participant leaves.
- Detection matches on the executable and its metadata, never on window titles, which routinely leak document names.

## Polling

`use-game-activity` is a TanStack Query with a 30-second `refetchInterval` rather than a hand-rolled timer, and `refetchOnWindowFocus` is off so tabbing back does not re-scan. The game index is cached on the Rust side for five minutes; the running-process check is not, since that is the part that has to stay live.

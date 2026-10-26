# Room music

A room can listen to music together. There are four kinds of source, and none of them sends someone else's catalogue through our servers.

| Source                       | Who plays the audio                                         | Server role                                          |
| ---------------------------- | ----------------------------------------------------------- | ---------------------------------------------------- |
| YouTube / SoundCloud / Vimeo link | every listener's own official embed (IFrame API, Widget API, `@vimeo/player`) | keeps the shared queue and the playback clock |
| Direct link to an audio/video file | every listener's own `<video>` element             | checks the `Content-Type`, keeps the queue           |
| Internet radio (Radio Browser) | every listener's own `<audio>` on the station's stream      | searches the directory, keeps the queue              |
| "My music" (tab audio, local files) | the sharer publishes a LiveKit track                  | none — it is an ordinary track in the SFU            |

## Why not a bot that streams YouTube or VK

Discord's Groovy and Rythm streamed YouTube audio into calls from a server and were shut down by YouTube in 2021. VK closed its public audio API to third-party apps, and Yandex Music has no public playback API. Re-streaming any of them from our side is a takedown waiting to happen, and a risk for the Play listing. So:

- **Links** play in the official embeds on each listener's device. We only store the video id or the track URL, the title and a thumbnail.
- **VK Music, Yandex Music and anything else** go through "My music → Share a tab's audio": the user plays it in their own account and publishes the tab's audio, exactly like screen sharing. The person sharing is responsible for what they share. Pasting a VK, Yandex Music, Spotify, Apple Music, Zvuk or Deezer link says exactly that instead of searching radio (`TAB_ONLY_SERVICES`).
- **Direct file links** (`https://…/*.mp3|ogg|opus|m4a|aac|flac|wav|mp4|webm`) are probed once by the server through `safeFetch` (the first 4 KB, SSRF-safe) and refused unless the answer is `audio/*`, `video/*` or `application/ogg`. Listeners then load the file straight from that host, like a radio stream.

### Why not react-player

The embeds are thin glue over each service's official API (`player-adapters.ts`: play, pause, seek, volume, position, duration). react-player v3 covers YouTube, Vimeo and files but dropped SoundCloud, and it does not expose YouTube's error codes, which tell a removed video (skipped for everyone) from a restriction that only one listener hits (only that listener is told). The official SDKs are used directly instead; adding a source means one adapter and one frame.
- **Local files** are decoded in the browser and published from a `MediaStreamAudioDestinationNode`; nothing is uploaded.

## The shared queue

`apps/server/src/modules/music` keeps one in-memory state per room (`music-store.ts`, a plain module like the presence store): the current track, the queue and the playback clock.

```text
playback = { status: 'playing', startedAt } | { status: 'paused', positionMs }
position = playing ? serverNow - startedAt : positionMs
```

Every mutation (`POST /music/rooms/:id/queue`, `DELETE …/queue/:trackId`, `POST …/playback`) goes through the pure functions in `lib/` and is broadcast to the room's subscribers as `room.music` with `serverTime` and a `revision`. The client stores `serverTime - receivedAt` as a clock offset (`toRoomMusicView`) and computes the expected position from it, so listeners line up without their clocks agreeing. Each player re-seeks when it drifts by more than two seconds.

- **Snapshots are ordered by `revision`.** The HTTP response to a mutation and the `room.music` event travel on different connections, so an older snapshot can arrive after a newer one. The revision only grows (`max(last + 1, Date.now())`, so it keeps growing across a restart) and the client drops any snapshot older than the one it holds (`writeRoomMusicCache`, `isStaleRoomMusic`).
- **Only visible participants control it.** Reading needs room access; changing anything needs a live LiveKit presence in that room (`MUSIC_NOT_IN_ROOM`). Presence lives in memory, so after a server restart a miss triggers one `syncRoom` before refusing — otherwise a deploy in the middle of a call would lock everyone out of the queue. An invisible admin is refused too: `addedBy` is broadcast, and it would give them away.
- **`next` names the track it ends.** Every listener reports the end of a track, and a removed video reports it too; the server advances only when `trackId` is still current, so N reports skip once.
- **Radio is live.** Seeking is refused, and resuming re-joins the live edge rather than the old position.
- **Clients resync** on a realtime reconnect and whenever the room is (re)joined (`refetchOnMount: 'always'`), since events missed while away are gone.
- **The state is volatile**, like presence: a restart forgets it, and a room nobody has been in for two minutes is cleared by `MusicSweeperService`.
- **Artwork** is downloaded once through `saveRemoteImage` (SSRF-safe, resized to WebP) into `uploads/music-artwork`, so listeners never load images from arbitrary hosts. Radio search results carry no favicon for the same reason.

## On the client

- `entities/room/music` — the API hooks, the clock offset and `RoomMusicRealtimeSync`, which writes every `room.music` event into the query cache.
- `features/room/room-music` — the player and `RoomMusicProvider`, which lives inside `LiveKitRoom` so the music survives navigation together with the call ([room-session.md](room-session.md)).
- **Minibar.** While something plays, a slim bar shows the live video thumbnail, the title, previous / play-pause / next, the volume button and an expand button, with a 2 px progress line. It is pinned under the room header and floats in the corner when the room is minimised, like the mini room bar; pinned, it folds open and shut, floating, it slides in (`MusicBarFrame`, the same element in both modes so a radio stream never restarts). Clicking it, the expand button or the music button in the control bar opens the player. When nothing from the queue plays but someone shares a tab, the listener bar (`RemoteShareBar`) shows who it is, with the same volume button.
- **An invisible admin only listens.** The server would refuse their mutations anyway, so the client doesn't offer them: `canControl` in the room music context (`useCanControlMusic`) is false, the music button in the control bar is hidden, and the minibar shows the track without its controls and doesn't open the player.
- **Player dialog.** The expanded view: "now playing" — the video (or the station's artwork), title, a seek bar on the room clock (`MusicPlayerAdapter.readDurationMs` for the length) and one control bar under it — previous / play / next, the listener's volume, the time (a live badge for radio) and a ⋯ menu (open the source, turn the music off for everyone) — and the library under it, three tabs (`MusicLibrary`): **Queue** (a field for a link, the queue; plain text offers to search radio for it), **Radio** (a station search, mood chips, and the most-clicked stations while the field is empty — the server's search without a name) and **My music** (sharing a tab's audio or files, as two cards). Below `lg` "now playing" is one compact row above the tabs; from `lg` it is the left column. It replaced one long scroll (input, hint, chips, a large empty state, the queue, My music, volume) where My music ended below the fold. It works with nothing playing too.
- **One iframe, never moved.** Re-parenting an iframe reloads it, so the embed lives in `MusicPlayerHost`, a fixed-position element portalled to `<body>` once per track. Its box follows the active slot every frame (`usePlayerPlacement`): the minibar thumbnail normally, the dialog's video area while the dialog is open (then it is raised above the dialog and takes pointer events). Because the host sits on `<body>`, it would float over anything that covers its slot — the room chat slides over the room at full height — so `readSlotBox` hit-tests the slot's centre and hides the host while something else is on top. Otherwise the video is always visible.
- **Previous.** `previous` restarts the current track when it has played more than 3 s (or there is no history) and otherwise goes back to the last finished track, pushing the current one to the front of the queue. The server keeps the last 20 tracks per room (`history`); it is not part of the snapshot.
- **The volume is each listener's own.** `settings.music.volume` lives on the device and is set where the music plays: inline in the player's control bar, behind the volume button on the minibar and the listener bar, and next to a files share for the one sharing. Nothing lowers it on its own — the old ducking (music down to 25% while someone spoke) was removed in 1.13, and so were the per-person music sliders of 1.12: two volumes multiplying each other confused people. Deafen silences music; a blocked sharer's music stays silent.
- **The YouTube embed hides its own controls** (`controls: 0`, `disablekb`, `iv_load_policy: 3`): ours drive it, and two seek bars over one video confused people.
- **One `next` per listener.** Each player reports the end of its track once (`useTrackAdvance`).
- **A player failure is the listener's own.** Only a removed or private YouTube video (error 100) is skipped for everyone. Everything else can be local — an age or region restriction (YouTube 101/150/153), a SoundCloud widget error, a Vimeo video that rejects, a file or radio stream that fails, a blocked network — and skipping it for the room let one listener throw tracks away for everyone. So the player reports why (`PlayerReport`: `network`, `restricted`, `failed`, `blocked`), the stage shows `PlayerStatusNotice` with Retry and, for those who can control the music, Next track, and the minibar says "not playing for you". A player that is not ready within 15 s (`PLAYER_LOAD_TIMEOUT_MS`) counts as a blocked network; an autoplay refusal (`NotAllowedError`) asks for one press. Retry remounts the player (`playerAttempt` in the context) and forgets a YouTube script that timed out, so a VPN switched on in between takes effect.
- **Music tracks are `Track.Source.Unknown` named `music`**, published with `musicHighQualityStereo`, no DTX and no RED. `RoomAudioRenderer` already plays that source; `useRemoteMusicVolume` applies the listener's music volume to it.

## Code layout

`features/room/room-music/model/` follows the slice convention: `contexts/` holds `RoomMusicProvider`, `hooks/` holds every hook behind one barrel (`hooks/index.ts`). With some thirty hooks the folder is split by subsystem; the subfolders have no barrels of their own, and files inside `hooks/` import each other directly:

| Folder | What lives there |
| --- | --- |
| `hooks/` (top level) | thin readers of the context (the current music, who may control it, the dialog, the music volume, "play in room") and what the provider composes (the volume ramp, remote-music detection) |
| `hooks/playback/` | controls, progress, the clock sync, track duration, advancing to the next track |
| `hooks/players/` | one hook per embed (YouTube, SoundCloud, Vimeo, file, radio) over `use-music-player`, the player status and its notice, the iframe host placement, the stage slot, its control bar and ⋯ menu |
| `hooks/library/` | the dialog's tabs: the link and radio fields, the station search, enqueueing, the queue |
| `hooks/share/` | "My music" (the share engine, tab audio, files), the listener bar and the volume of someone else's shared music |
| `hooks/mini-bar/` | the minibar and the space it reserves while floating |

## Shared audio without echo

Sharing the whole screen with system audio used to capture the call itself, so viewers heard the room twice. Every display capture — screen share and "Share a tab's audio" — now asks for `restrictOwnAudio` (the page's own playback is excluded from system audio), excludes Chatovo's own tab from the picker (`selfBrowserSurface: 'exclude'`) and turns voice processing off. The constraints live in `DISPLAY_AUDIO_CAPTURE` in `shared/lib/screen-share`. Browsers that do not implement `restrictOwnAudio` ignore it; sharing a single tab or window is echo-free everywhere. The picture has the same trap: a sharer who opened their own screen share saw it repeat inside itself hundreds of times, so the local participant's card shows `LocalScreenNotice` ("you're sharing your screen", with Stop sharing) instead of the preview; everyone else gets the video. The camera's mirror setting applies to the camera track only, never to a shared screen. Both captures also pass a fresh `CaptureController` set to `no-focus-change` (`createCaptureController` in `shared/lib/screen-share`), so picking a tab or window to share no longer switches the browser to it; browsers without `CaptureController` keep their default.

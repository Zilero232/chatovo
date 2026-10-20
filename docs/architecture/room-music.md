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

The embeds are thin glue over each service's official API (`player-adapters.ts`: play, pause, seek, volume, position, duration). react-player v3 covers YouTube, Vimeo and files but dropped SoundCloud, and it does not expose YouTube's error codes, which the "skip an unplayable track for everyone" rule relies on. The official SDKs are used directly instead; adding a source means one adapter and one frame.
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
- **`next` names the track it ends.** Every listener reports the end of a track, and an unplayable embed reports it too; the server advances only when `trackId` is still current, so N reports skip once.
- **Radio is live.** Seeking is refused, and resuming re-joins the live edge rather than the old position.
- **Clients resync** on a realtime reconnect and whenever the room is (re)joined (`refetchOnMount: 'always'`), since events missed while away are gone.
- **The state is volatile**, like presence: a restart forgets it, and a room nobody has been in for two minutes is cleared by `MusicSweeperService`.
- **Artwork** is downloaded once through `saveRemoteImage` (SSRF-safe, resized to WebP) into `uploads/music-artwork`, so listeners never load images from arbitrary hosts. Radio search results carry no favicon for the same reason.

## On the client

- `entities/room/music` — the API hooks, the clock offset and `RoomMusicRealtimeSync`, which writes every `room.music` event into the query cache.
- `features/room/room-music` — the player and `RoomMusicProvider`, which lives inside `LiveKitRoom` so the music survives navigation together with the call ([room-session.md](room-session.md)).
- **Minibar.** While something plays, a slim bar shows the live video thumbnail, the title, previous / play-pause / next and an expand button, with a 2 px progress line. It is pinned under the room header and floats in the corner when the room is minimised, like the mini room bar. Clicking it, the expand button or the music button in the control bar opens the player.
- **Player dialog.** The expanded view: the video (or the station's artwork), title, a seekable progress bar on the room clock (`MusicPlayerAdapter.readDurationMs` for the length; radio shows a live chip), previous / play / next / stop, and the library beside it — one input that takes a link or a radio search, genre chips, the queue, "My music", volume and ducking. It works with nothing playing too.
- **One iframe, never moved.** Re-parenting an iframe reloads it, so the embed lives in `MusicPlayerHost`, a fixed-position element portalled to `<body>` once per track. Its box follows the active slot every frame (`usePlayerPlacement`): the minibar thumbnail normally, the dialog's video area while the dialog is open (then it is raised above the dialog and takes pointer events). The video is always visible — never played from a hidden player.
- **Previous.** `previous` restarts the current track when it has played more than 3 s (or there is no history) and otherwise goes back to the last finished track, pushing the current one to the front of the queue. The server keeps the last 20 tracks per room (`history`); it is not part of the snapshot.
- **Ducking.** While anyone else speaks, music drops to 25% and comes back 0.8 s after the last word. Speech is measured on remote microphone tracks only (`speech-probe`), not with LiveKit's `isSpeaking`, so a participant who shares music does not keep everyone ducked. The probes share one `AudioContext` and run only while some music is actually playing in the room. Deafen silences music too.
- **One `next` per listener.** Each player reports the end of its track once (`useTrackAdvance`); embeds that cannot play a track at all (YouTube 2/100/101/150, a SoundCloud widget error, a Vimeo video that never becomes ready, a file the browser cannot decode) skip it, while errors that are local to one listener only show a toast.
- **Music tracks are `Track.Source.Unknown` named `music`**, published with `musicHighQualityStereo`, no DTX and no RED. `RoomAudioRenderer` already plays that source; `useRemoteMusicVolume` applies the music volume to it.

## Shared audio without echo

Sharing the whole screen with system audio used to capture the call itself, so viewers heard the room twice. Every display capture — screen share and "Share a tab's audio" — now asks for `restrictOwnAudio` (the page's own playback is excluded from system audio), excludes Chatovo's own tab from the picker (`selfBrowserSurface: 'exclude'`) and turns voice processing off. The constraints live in `DISPLAY_AUDIO_CAPTURE` in `shared/lib/screen-share`. Browsers that do not implement `restrictOwnAudio` ignore it; sharing a single tab or window is echo-free everywhere.

export const MUSIC_TRACK_NAME = 'music';

export const MUSIC_FILE_ACCEPT = 'audio/*';

export const DUCKING = {
  level: 0.25,
  speechLevel: 0.12,
  holdMs: 800,
  pollMs: 100
} as const;

export const VOLUME_RAMP = {
  durationMs: 250,
  stepMs: 25
} as const;

export const PLAYBACK_SYNC = {
  driftToleranceMs: 2_000,
  checkIntervalMs: 4_000
} as const;

export const YOUTUBE = {
  loadTimeoutMs: 15_000,
  apiSrc: 'https://www.youtube.com/iframe_api',
  host: 'https://www.youtube-nocookie.com',
  playerVars: { autoplay: 0, playsinline: 1, rel: 0 },
  fatalErrorCodes: new Set([2, 100, 101, 150]),
  state: { ended: 0, playing: 1 }
} as const;

export const SOUNDCLOUD = {
  apiSrc: 'https://w.soundcloud.com/player/api.js',
  widgetUrl: 'https://w.soundcloud.com/player/'
} as const;

export const VIMEO_OPTIONS = {
  autoplay: false,
  dnt: true,
  playsinline: true,
  title: false,
  byline: false,
  portrait: false
} as const;

export const MEDIA_ERROR_UNSUPPORTED = 4;

export const RADIO_SEARCH_DEBOUNCE_MS = 400;

export const TRACK_ARTWORK_SIZES = { sm: '2.5rem', lg: '3rem', fill: '28rem' } as const;

export const PLAYBACK_PROGRESS = {
  tickMs: 1_000,
  durationPollMs: 1_000,
  seekStepMs: 5_000,
  keyboardCommitMs: 450
} as const;

export const RADIO_GENRES = [
  { id: 'lofi', query: 'lofi' },
  { id: 'jazz', query: 'jazz' },
  { id: 'rock', query: 'rock' },
  { id: 'classical', query: 'classical' },
  { id: 'ambient', query: 'ambient' },
  { id: 'chill', query: 'chill' }
] as const;

export const STRIP_SPACE = {
  dockedVar: '--now-playing-offset',
  floatingVar: '--now-playing-floating-space',
  floatingGapPx: 16
} as const;

export const TAB_ONLY_SERVICES = [
  { id: 'vk', hosts: ['vk.com', 'vk.ru', 'm.vk.com', 'vkvideo.ru'] },
  { id: 'yandex', hosts: ['music.yandex.ru', 'music.yandex.com'] },
  { id: 'spotify', hosts: ['open.spotify.com'] },
  { id: 'apple', hosts: ['music.apple.com'] },
  { id: 'zvuk', hosts: ['zvuk.com'] },
  { id: 'deezer', hosts: ['deezer.com', 'www.deezer.com'] }
] as const;

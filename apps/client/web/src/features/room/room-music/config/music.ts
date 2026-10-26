export const MUSIC_TRACK_NAME = 'music';

export const MUSIC_FILE_ACCEPT = 'audio/*';

export const PLAYER_LOAD_TIMEOUT_MS = 15_000;

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
  playerVars: { autoplay: 0, controls: 0, disablekb: 1, iv_load_policy: 3, playsinline: 1, rel: 0 },
  removedErrorCodes: new Set([100]),
  restrictedErrorCodes: new Set([101, 150, 153]),
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

export const FLOATING_BAR_SPACE = {
  cssVar: '--now-playing-floating-space',
  gapPx: 16
} as const;

export const TAB_ONLY_SERVICES = [
  { id: 'vk', hosts: ['vk.com', 'vk.ru', 'm.vk.com', 'vkvideo.ru'] },
  { id: 'yandex', hosts: ['music.yandex.ru', 'music.yandex.com'] },
  { id: 'spotify', hosts: ['open.spotify.com'] },
  { id: 'apple', hosts: ['music.apple.com'] },
  { id: 'zvuk', hosts: ['zvuk.com'] },
  { id: 'deezer', hosts: ['deezer.com', 'www.deezer.com'] }
] as const;

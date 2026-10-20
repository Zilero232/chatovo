import type { GetMusicPositionMsInput, MusicLink } from './types';

const YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com'
]);

const YOUTUBE_PATH_PREFIXES = new Set(['shorts', 'live', 'embed']);

const YOUTUBE_VIDEO_ID = /^[\w-]{11}$/;

const SOUNDCLOUD_HOSTS = new Set(['soundcloud.com', 'www.soundcloud.com', 'm.soundcloud.com']);

const SOUNDCLOUD_SLUG = /^[\w-]+$/;

const SOUNDCLOUD_RESERVED = new Set([
  'charts',
  'discover',
  'feed',
  'pages',
  'people',
  'search',
  'stations',
  'stream',
  'tags',
  'upload',
  'you'
]);

const SOUNDCLOUD_NOT_TRACK = new Set([
  'albums',
  'comments',
  'followers',
  'following',
  'likes',
  'popular-tracks',
  'reposts',
  'sets',
  'tracks'
]);

const VIMEO_HOSTS = new Set(['vimeo.com', 'www.vimeo.com', 'player.vimeo.com']);

const VIMEO_ID = /^\d{6,12}$/;

const VIMEO_HASH = /^[\da-f]{6,20}$/i;

const MEDIA_FILE_EXTENSION = /\.(?:aac|flac|m4a|mp3|mp4|oga|ogg|opus|wav|webm)$/i;

const parseUrl = (value: string): URL | null => {
  try {
    return new URL(value);
  } catch {
    return null;
  }
};

const pathSegments = (url: URL): string[] => url.pathname.split('/').filter(Boolean);

const readYoutubeVideoId = (url: URL): string | null => {
  const [first, second] = pathSegments(url);

  if (url.hostname === 'youtu.be') {
    return first ?? null;
  }

  if (!YOUTUBE_HOSTS.has(url.hostname)) {
    return null;
  }

  if (first === 'watch') {
    return url.searchParams.get('v');
  }

  return first && YOUTUBE_PATH_PREFIXES.has(first) ? (second ?? null) : null;
};

const parseYoutube = (url: URL): MusicLink | null => {
  const videoId = readYoutubeVideoId(url);

  if (!videoId || !YOUTUBE_VIDEO_ID.test(videoId)) {
    return null;
  }

  return { source: 'youtube', ref: videoId, url: `https://www.youtube.com/watch?v=${videoId}` };
};

const parseSoundcloud = (url: URL): MusicLink | null => {
  if (!SOUNDCLOUD_HOSTS.has(url.hostname)) {
    return null;
  }

  const segments = pathSegments(url).map((segment) => segment.toLowerCase());
  const [user, track] = segments;

  if (
    segments.length !== 2 ||
    !user ||
    !track ||
    SOUNDCLOUD_RESERVED.has(user) ||
    SOUNDCLOUD_NOT_TRACK.has(track) ||
    !SOUNDCLOUD_SLUG.test(user) ||
    !SOUNDCLOUD_SLUG.test(track)
  ) {
    return null;
  }

  const canonical = `https://soundcloud.com/${user}/${track}`;

  return { source: 'soundcloud', ref: canonical, url: canonical };
};

const parseVimeo = (url: URL): MusicLink | null => {
  if (!VIMEO_HOSTS.has(url.hostname)) {
    return null;
  }

  const segments = pathSegments(url);
  const idIndex = segments.findIndex((segment) => VIMEO_ID.test(segment));
  const id = segments[idIndex];

  if (!id) {
    return null;
  }

  const hash = url.searchParams.get('h') ?? segments[idIndex + 1];
  const canonical =
    hash && VIMEO_HASH.test(hash) ? `https://vimeo.com/${id}/${hash}` : `https://vimeo.com/${id}`;

  return { source: 'vimeo', ref: canonical, url: canonical };
};

const parseMediaFile = (url: URL): MusicLink | null => {
  if (url.protocol !== 'https:' || !MEDIA_FILE_EXTENSION.test(url.pathname)) {
    return null;
  }

  return { source: 'file', ref: url.href, url: url.href };
};

/**
 * Recognises one YouTube video, SoundCloud track, Vimeo video or direct https audio/video file link
 * and returns it in canonical form; null for anything else (playlists, profiles, other sites).
 */
export const parseMusicLink = (value: string): MusicLink | null => {
  const url = parseUrl(value.trim());

  if (!url || (url.protocol !== 'https:' && url.protocol !== 'http:')) {
    return null;
  }

  return parseYoutube(url) ?? parseSoundcloud(url) ?? parseVimeo(url) ?? parseMediaFile(url);
};

/** Playback position of a room track in milliseconds at `now`, by the server's clock. */
export const getMusicPositionMs = ({ playback, now }: GetMusicPositionMsInput): number =>
  playback.status === 'playing' ? Math.max(0, now - playback.startedAt) : playback.positionMs;

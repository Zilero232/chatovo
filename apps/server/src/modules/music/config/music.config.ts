import { CronExpression } from '@nestjs/schedule';
import { hoursToMilliseconds, minutesToMilliseconds, secondsToMilliseconds } from 'date-fns';

import type { RoomMusicState } from '../music.types';

export const EMPTY_ROOM_MUSIC: RoomMusicState = {
  current: null,
  playback: null,
  queue: [],
  history: []
};

export const MUSIC = {
  history: {
    maxLength: 20,
    restartAfterMs: 3_000
  },
  room: {
    emptyRoomGraceMs: minutesToMilliseconds(2),
    sweepIntervalMs: secondsToMilliseconds(30)
  },
  oembed: {
    youtube: 'https://www.youtube.com/oembed',
    soundcloud: 'https://soundcloud.com/oembed',
    vimeo: 'https://vimeo.com/api/oembed.json',
    accept: 'application/json',
    maxBytes: 64 * 1024,
    cacheTtlMs: hoursToMilliseconds(6),
    failureCacheTtlMs: minutesToMilliseconds(5)
  },
  mediaFile: {
    accept: 'audio/*, video/*;q=0.9, application/ogg;q=0.8',
    probeBytes: 4 * 1024
  },
  youtubeThumbnailBase: 'https://i.ytimg.com/vi',
  radio: {
    apiBase: 'https://all.api.radio-browser.info/json',
    accept: 'application/json',
    maxBytes: 1024 * 1024,
    searchLimit: 30,
    fetchLimit: 90,
    maxTags: 4,
    playableCodecs: new Set(['AAC', 'AAC+', 'MP3', 'OGG', 'OPUS']),
    cacheTtlMs: minutesToMilliseconds(10),
    failureCacheTtlMs: minutesToMilliseconds(1)
  },
  artwork: {
    folder: 'music-artwork',
    maxBytes: 5 * 1024 * 1024,
    maxWidth: 320,
    quality: 80,
    maxAgeMs: hoursToMilliseconds(24 * 7),
    sweepCron: CronExpression.EVERY_DAY_AT_5AM
  },
  cacheMaxEntries: 2000,
  throttle: {
    read: { limit: 120, ttl: minutesToMilliseconds(1) },
    write: { limit: 40, ttl: minutesToMilliseconds(1) }
  }
} as const;

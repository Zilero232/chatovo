import { z } from 'zod';

import { MUSIC_LINK_MAX_LENGTH, MUSIC_TITLE_MAX_LENGTH } from './limits';

const httpsUrlSchema = z.url({ protocol: /^https$/ }).max(MUSIC_LINK_MAX_LENGTH);

export const musicSourceSchema = z.enum(['youtube', 'soundcloud', 'vimeo', 'file', 'radio']);

export const musicTrackSchema = z.object({
  id: z.uuid(),
  source: musicSourceSchema,
  ref: z.string().min(1).max(MUSIC_LINK_MAX_LENGTH),
  url: httpsUrlSchema,
  title: z.string().min(1).max(MUSIC_TITLE_MAX_LENGTH),
  artist: z.string().max(MUSIC_TITLE_MAX_LENGTH).nullable(),
  artwork: z.url({ protocol: /^https?$/ }).nullable(),
  addedBy: z.object({
    id: z.string().min(1),
    name: z.string()
  })
});

export const musicPlaybackSchema = z.discriminatedUnion('status', [
  z.object({ status: z.literal('playing'), startedAt: z.number() }),
  z.object({ status: z.literal('paused'), positionMs: z.number().nonnegative() })
]);

export const roomMusicSchema = z.object({
  roomId: z.uuid(),
  current: musicTrackSchema.nullable(),
  playback: musicPlaybackSchema.nullable(),
  queue: z.array(musicTrackSchema),
  revision: z.number().int().nonnegative(),
  serverTime: z.number()
});

export const radioStationSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).max(MUSIC_TITLE_MAX_LENGTH),
  country: z.string().nullable(),
  tags: z.array(z.string()),
  codec: z.string().nullable(),
  bitrate: z.number().int().nonnegative().nullable()
});

export const radioStationsResponseSchema = z.object({
  stations: z.array(radioStationSchema)
});

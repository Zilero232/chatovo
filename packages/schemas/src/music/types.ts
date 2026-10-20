import type { z } from 'zod';

import type {
  musicEnqueueInputSchema,
  musicEnqueueItemSchema,
  musicLinkFormSchema,
  musicPlaybackCommandSchema,
  musicPlaybackInputSchema,
  radioSearchQuerySchema
} from './inputs';
import type {
  musicPlaybackSchema,
  musicSourceSchema,
  musicTrackSchema,
  radioStationSchema,
  radioStationsResponseSchema,
  roomMusicSchema
} from './outputs';

export type MusicSource = z.infer<typeof musicSourceSchema>;
export type MusicTrack = z.infer<typeof musicTrackSchema>;
export type MusicPlayback = z.infer<typeof musicPlaybackSchema>;
export type RoomMusic = z.infer<typeof roomMusicSchema>;
export type RadioStation = z.infer<typeof radioStationSchema>;
export type RadioStationsResponse = z.infer<typeof radioStationsResponseSchema>;
export type MusicEnqueueItem = z.infer<typeof musicEnqueueItemSchema>;
export type MusicEnqueueInput = z.infer<typeof musicEnqueueInputSchema>;
export type MusicLinkForm = z.infer<typeof musicLinkFormSchema>;
export type MusicPlaybackCommand = z.infer<typeof musicPlaybackCommandSchema>;
export type MusicPlaybackInput = z.infer<typeof musicPlaybackInputSchema>;
export type RadioSearchQuery = z.input<typeof radioSearchQuerySchema>;

export type MusicLink = {
  source: Exclude<MusicSource, 'radio'>;
  ref: string;
  url: string;
};

export type GetMusicPositionMsInput = {
  playback: MusicPlayback;
  now: number;
};

import { z } from 'zod';

import { parseMusicLink } from './lib';
import { MUSIC_LINK_MAX_LENGTH, RADIO_SEARCH_QUERY_MAX_LENGTH } from './limits';

export const musicEnqueueItemSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('link'),
    url: z.url({ protocol: /^https?$/ }).max(MUSIC_LINK_MAX_LENGTH)
  }),
  z.object({
    kind: z.literal('radio'),
    stationId: z.uuid()
  })
]);

export const musicPlaybackCommandSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('play') }),
  z.object({ action: z.literal('pause') }),
  z.object({ action: z.literal('seek'), positionMs: z.number().int().nonnegative() }),
  z.object({ action: z.literal('next'), trackId: z.uuid() }),
  z.object({ action: z.literal('previous') }),
  z.object({ action: z.literal('stop') })
]);

export const musicEnqueueInputSchema = z.object({ item: musicEnqueueItemSchema });

export const musicPlaybackInputSchema = z.object({ command: musicPlaybackCommandSchema });

export const radioSearchQuerySchema = z.object({
  query: z.string().trim().max(RADIO_SEARCH_QUERY_MAX_LENGTH).default('')
});

export const musicLinkFormSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, 'validation.linkRequired')
    .max(MUSIC_LINK_MAX_LENGTH, 'validation.linkUnsupported')
    .refine((value) => parseMusicLink(value) !== null, 'validation.linkUnsupported')
});

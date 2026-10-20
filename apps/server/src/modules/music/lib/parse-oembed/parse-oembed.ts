import { MUSIC_TITLE_MAX_LENGTH, safeJsonParse } from '@chatovo/schemas';
import { z } from 'zod';

import type { MusicTrackMeta } from '../../music.types';

const oembedSchema = z.object({
  title: z.string().trim().min(1),
  author_name: z.string().trim().optional(),
  thumbnail_url: z
    .url({ protocol: /^https$/ })
    .optional()
    .catch(undefined)
});

export const parseOembed = (body: string): MusicTrackMeta | null => {
  const parsed = oembedSchema.safeParse(safeJsonParse(body));

  if (!parsed.success) {
    return null;
  }

  const { title, author_name: artist, thumbnail_url: thumbnailUrl } = parsed.data;

  return {
    title: title.slice(0, MUSIC_TITLE_MAX_LENGTH),
    artist: artist ? artist.slice(0, MUSIC_TITLE_MAX_LENGTH) : null,
    thumbnailUrl: thumbnailUrl ?? null
  };
};

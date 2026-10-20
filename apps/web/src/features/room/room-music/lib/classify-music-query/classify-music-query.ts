import { parseMusicLink } from '@chatovo/schemas';

import type { MusicQuery, TabOnlyService } from './classify-music-query.types';

import { TAB_ONLY_SERVICES } from '../../config/music';

const findTabOnlyService = (query: string): TabOnlyService | null => {
  if (!URL.canParse(query)) {
    return null;
  }

  const { hostname } = new URL(query);
  const service = TAB_ONLY_SERVICES.find(({ hosts }) =>
    (hosts as readonly string[]).includes(hostname)
  );

  return service?.id ?? null;
};

export const classifyMusicQuery = (value: string): MusicQuery => {
  const query = value.trim();

  if (query === '') {
    return { kind: 'idle' };
  }

  const link = parseMusicLink(query);

  if (link) {
    return { kind: 'link', link };
  }

  const service = findTabOnlyService(query);

  return service ? { kind: 'tab-only', service } : { kind: 'search', query };
};

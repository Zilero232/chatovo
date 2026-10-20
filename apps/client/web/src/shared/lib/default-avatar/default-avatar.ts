import { botttsNeutral } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';

const BACKGROUND_COLORS = ['6fdcd0', '8b7cf6', 'ea6ff0', 'a3e635', '38bdf8', 'fb7185'];

const cache = new Map<string, string>();

export const getDefaultAvatar = (seed: string): string => {
  const cached = cache.get(seed);

  if (cached) {
    return cached;
  }

  const svg = createAvatar(botttsNeutral, {
    seed,
    radius: 50,
    backgroundColor: BACKGROUND_COLORS,
    backgroundType: ['solid']
  }).toString();

  const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

  cache.set(seed, dataUri);

  return dataUri;
};

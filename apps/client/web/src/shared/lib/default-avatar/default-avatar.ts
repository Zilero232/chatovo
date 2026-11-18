import { Avatar, Style } from '@dicebear/core';
import botttsNeutral from '@dicebear/styles/bottts-neutral.json';

const BACKGROUND_COLORS = ['6fdcd0', '8b7cf6', 'ea6ff0', 'a3e635', '38bdf8', 'fb7185'];

const style = new Style(botttsNeutral);

const cache = new Map<string, string>();

export const getDefaultAvatar = (seed: string): string => {
  const cached = cache.get(seed);

  if (cached) {
    return cached;
  }

  const dataUri = new Avatar(style, {
    seed,
    borderRadius: 50,
    backgroundColor: BACKGROUND_COLORS,
    backgroundColorFill: ['solid']
  }).toDataUri();

  cache.set(seed, dataUri);

  return dataUri;
};

import { MUSIC_TITLE_MAX_LENGTH } from '@chatovo/schemas';

import type { MusicTrackMeta } from '../../music.types';
import type { DescribeMediaFileInput } from './describe-media-file.types';

const MEDIA_CONTENT_TYPE = /^(?:audio\/|video\/|application\/ogg)/i;

const decodeURIComponentSafe = (value: string): string => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const readFileTitle = (url: URL): string => {
  const name = url.pathname.split('/').at(-1) ?? '';
  const title = decodeURIComponentSafe(name)
    .replace(/\.[^.]+$/, '')
    .replace(/[_+]+/g, ' ')
    .trim();

  return title === '' ? url.hostname : title;
};

export const describeMediaFile = ({
  url,
  contentType
}: DescribeMediaFileInput): MusicTrackMeta | null => {
  if (!MEDIA_CONTENT_TYPE.test(contentType)) {
    return null;
  }

  const parsed = new URL(url);

  return {
    title: readFileTitle(parsed).slice(0, MUSIC_TITLE_MAX_LENGTH),
    artist: parsed.hostname,
    thumbnailUrl: null
  };
};

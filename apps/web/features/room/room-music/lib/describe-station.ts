import type { RadioStation } from '@chatovo/schemas';

export const describeStation = ({ country, tags }: RadioStation): string =>
  [country, ...tags].filter(Boolean).join(' · ');

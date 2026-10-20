import type { MusicTrack } from '@chatovo/schemas';

export type TrackArtworkProps = {
  track: Pick<MusicTrack, 'artwork' | 'source'>;
  size: 'fill' | 'lg' | 'sm';
  className?: string;
};

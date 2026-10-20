import type { MusicTrack } from '@chatovo/schemas';
import type { ReactNode } from 'react';

export type QueueItemProps = {
  action: ReactNode;
  caption: string;
  track: MusicTrack;
};

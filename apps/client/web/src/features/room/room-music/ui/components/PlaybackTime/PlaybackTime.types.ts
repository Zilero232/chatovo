import type { usePlaybackProgress } from '../../../model/hooks';

export type PlaybackTimeProps = {
  progress: ReturnType<typeof usePlaybackProgress>;
  className?: string;
};

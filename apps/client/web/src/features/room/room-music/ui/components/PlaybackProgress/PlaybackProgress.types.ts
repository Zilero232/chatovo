import type { usePlaybackProgress } from '../../../model/hooks';

export type PlaybackProgressProps = {
  progress: ReturnType<typeof usePlaybackProgress>;
};

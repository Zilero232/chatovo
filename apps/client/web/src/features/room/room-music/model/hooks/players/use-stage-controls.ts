import type { MusicTrackPlayback } from '../../types';

import { usePlaybackControls } from '../playback/use-playback-controls';
import { usePlaybackProgress } from '../playback/use-playback-progress';

export const useStageControls = ({ music, track }: MusicTrackPlayback) => {
  const progress = usePlaybackProgress({ music, track });
  const controls = usePlaybackControls();

  return { progress, controls };
};

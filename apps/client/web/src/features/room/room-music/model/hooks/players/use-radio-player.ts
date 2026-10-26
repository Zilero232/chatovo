import { useMemo, useState } from 'react';

import type { MusicTrackPlayback } from '../../types';

import { toLiveAudioAdapter } from '../../../lib/index';
import { useTrackAdvance } from '../playback/use-track-advance';
import { useMusicPlayer } from './use-music-player';

export const useRadioPlayer = ({ music, track }: MusicTrackPlayback) => {
  const { reportUnavailable } = useTrackAdvance(track.id);

  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);

  const adapter = useMemo(
    () => (audio ? toLiveAudioAdapter({ audio, onBlocked: () => setIsBlocked(true) }) : null),
    [audio]
  );

  useMusicPlayer({ music, track, adapter });

  const unblock = () => {
    setIsBlocked(false);
    adapter?.play();
  };

  return { setAudio, isBlocked, unblock, onError: () => reportUnavailable('failed') };
};

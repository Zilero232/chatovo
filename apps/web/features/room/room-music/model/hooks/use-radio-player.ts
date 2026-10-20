'use client';

import { useMemo, useState } from 'react';

import type { MusicTrackPlayback } from '../types';

import { toLiveAudioAdapter } from '../../lib';
import { useMusicPlayer } from './use-music-player';
import { useTrackAdvance } from './use-track-advance';

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

  return { setAudio, isBlocked, unblock, onError: reportUnavailable };
};

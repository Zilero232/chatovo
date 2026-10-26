import { useMemo, useState } from 'react';

import type { MusicTrackPlayback } from '../../types';

import { toMediaElementAdapter } from '../../../lib/index';
import { useTrackAdvance } from '../playback/use-track-advance';
import { useMusicPlayer } from './use-music-player';

export const useFilePlayer = ({ music, track }: MusicTrackPlayback) => {
  const { advance, reportUnavailable } = useTrackAdvance(track.id);

  const [media, setMedia] = useState<HTMLVideoElement | null>(null);

  const adapter = useMemo(
    () =>
      media
        ? toMediaElementAdapter({ media, onBlocked: () => reportUnavailable('blocked') })
        : null,
    [media, reportUnavailable]
  );

  useMusicPlayer({ music, track, adapter });

  return { setMedia, onEnded: advance, onError: () => reportUnavailable('failed') };
};

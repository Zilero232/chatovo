import type { SyntheticEvent } from 'react';

import { useMemo, useState } from 'react';

import type { MusicTrackPlayback } from '../types';

import { MEDIA_ERROR_UNSUPPORTED } from '../../config/music';
import { toMediaElementAdapter } from '../../lib';
import { useMusicPlayer } from './use-music-player';
import { useTrackAdvance } from './use-track-advance';

export const useFilePlayer = ({ music, track }: MusicTrackPlayback) => {
  const { advance, skipUnplayable, reportUnavailable } = useTrackAdvance(track.id);

  const [media, setMedia] = useState<HTMLVideoElement | null>(null);

  const adapter = useMemo(() => (media ? toMediaElementAdapter(media) : null), [media]);

  useMusicPlayer({ music, track, adapter });

  const onError = ({ currentTarget }: SyntheticEvent<HTMLVideoElement>) => {
    if (currentTarget.error?.code === MEDIA_ERROR_UNSUPPORTED) {
      skipUnplayable();
    } else {
      reportUnavailable();
    }
  };

  return { setMedia, onEnded: advance, onError };
};

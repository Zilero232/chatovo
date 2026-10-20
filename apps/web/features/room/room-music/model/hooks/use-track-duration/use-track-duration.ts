import { useEffect, useEffectEvent } from 'react';

import type { UseTrackDurationInput } from './use-track-duration.types';

import { PLAYBACK_PROGRESS } from '../../../config/music';
import { useRoomMusicContext } from '../../contexts/room-music-context';

export const useTrackDuration = ({ adapter, trackId }: UseTrackDurationInput) => {
  const { trackDuration, setTrackDuration } = useRoomMusicContext();

  const isKnown = trackDuration?.trackId === trackId;

  const store = useEffectEvent((durationMs: number) => setTrackDuration({ trackId, durationMs }));

  useEffect(() => {
    if (!adapter || isKnown) {
      return;
    }

    let isActive = true;

    const read = async () => {
      const durationMs = await adapter.readDurationMs();

      if (isActive && durationMs !== null) {
        store(durationMs);
      }
    };

    void read();

    const intervalId = setInterval(() => void read(), PLAYBACK_PROGRESS.durationPollMs);

    return () => {
      isActive = false;
      clearInterval(intervalId);
    };
  }, [adapter, isKnown]);
};

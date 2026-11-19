import { Track } from 'livekit-client';
import { useEffect } from 'react';

import type { UseWatchStreamInput } from './use-watch-stream.types';

import { watchedStreamStoreApi } from '../../stores';

export const useWatchStream = ({ trackRef, isWatching }: UseWatchStreamInput) => {
  const { participant, source } = trackRef;
  const { identity, isLocal } = participant;
  const isRemoteScreen = source === Track.Source.ScreenShare && !isLocal;

  useEffect(() => {
    if (!isRemoteScreen || !isWatching) {
      return;
    }

    watchedStreamStoreApi.set({ identity });

    return () => {
      if (watchedStreamStoreApi.get().identity === identity) {
        watchedStreamStoreApi.set({ identity: null });
      }
    };
  }, [identity, isRemoteScreen, isWatching]);
};

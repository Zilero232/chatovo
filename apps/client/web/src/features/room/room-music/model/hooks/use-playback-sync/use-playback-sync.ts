import { useEffect, useEffectEvent } from 'react';

import { getExpectedPositionMs } from '@/entities/room/music';

import type { UsePlaybackSyncInput } from './use-playback-sync.types';

import { PLAYBACK_SYNC } from '../../../config/music';

export const usePlaybackSync = ({ adapter, music, isLive }: UsePlaybackSyncInput) => {
  const { current, playback } = music;

  const status = playback?.status ?? null;
  const anchor = playback?.status === 'playing' ? playback.startedAt : playback?.positionMs;

  const readExpectedMs = useEffectEvent(() => getExpectedPositionMs({ music, now: Date.now() }));

  const applyPlayback = useEffectEvent(() => {
    if (!adapter || !status) {
      return;
    }

    if (!isLive) {
      adapter.seekTo(readExpectedMs());
    }

    if (status === 'playing') {
      adapter.play();
    } else {
      adapter.pause();
    }
  });

  useEffect(() => {
    applyPlayback();
  }, [adapter, current?.id, status, anchor]);

  useEffect(() => {
    if (!adapter || isLive || status !== 'playing') {
      return;
    }

    const correctDrift = async () => {
      const actualMs = await adapter.readPositionMs();
      const expectedMs = readExpectedMs();

      if (Math.abs(actualMs - expectedMs) > PLAYBACK_SYNC.driftToleranceMs) {
        adapter.seekTo(expectedMs);
      }
    };

    const intervalId = setInterval(() => void correctDrift(), PLAYBACK_SYNC.checkIntervalMs);

    return () => clearInterval(intervalId);
  }, [adapter, isLive, status]);
};

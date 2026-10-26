import { useEffect } from 'react';

import type { UseMusicPlayerInput } from './use-music-player.types';

import { PLAYER_LOAD_TIMEOUT_MS } from '../../../../config/music';
import { useRoomMusicContext } from '../../../contexts';
import { usePlaybackSync } from '../../playback/use-playback-sync';
import { useTrackDuration } from '../../playback/use-track-duration';
import { useVolumeRamp } from '../../use-volume-ramp';

export const useMusicPlayer = ({ music, track, adapter }: UseMusicPlayerInput) => {
  const { outputVolume, setPlayerReport } = useRoomMusicContext();

  const isLive = track.source === 'radio';

  usePlaybackSync({ adapter, music, isLive });

  useTrackDuration({ adapter: isLive ? null : adapter, trackId: track.id });

  useVolumeRamp({
    target: outputVolume,
    resetKey: adapter,
    apply: (volume) => adapter?.setVolume(volume)
  });

  useEffect(() => {
    if (adapter) {
      setPlayerReport({ trackId: track.id, status: 'ready' });

      return;
    }

    const timeoutId = setTimeout(setPlayerReport, PLAYER_LOAD_TIMEOUT_MS, {
      trackId: track.id,
      status: 'unavailable',
      failure: 'network'
    });

    return () => clearTimeout(timeoutId);
  }, [adapter, track.id, setPlayerReport]);
};

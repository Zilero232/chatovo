import type { UseMusicPlayerInput } from './use-music-player.types';

import { useRoomMusicContext } from '../../contexts/room-music-context';
import { usePlaybackSync } from '../use-playback-sync';
import { useTrackDuration } from '../use-track-duration';
import { useVolumeRamp } from '../use-volume-ramp';

export const useMusicPlayer = ({ music, track, adapter }: UseMusicPlayerInput) => {
  const { outputVolume } = useRoomMusicContext();

  const isLive = track.source === 'radio';

  usePlaybackSync({ adapter, music, isLive });

  useTrackDuration({ adapter: isLive ? null : adapter, trackId: track.id });

  useVolumeRamp({
    target: outputVolume,
    resetKey: adapter,
    apply: (volume) => adapter?.setVolume(volume)
  });
};

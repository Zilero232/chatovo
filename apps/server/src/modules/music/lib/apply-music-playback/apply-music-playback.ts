import { getMusicPositionMs } from '@chatovo/schemas';
import { match } from 'ts-pattern';

import type { RoomMusicState } from '../../music.types';
import type { ApplyMusicPlaybackInput } from './apply-music-playback.types';

import { EMPTY_ROOM_MUSIC, MUSIC } from '../../config';
import { advanceMusicQueue } from '../advance-music-queue';
import { rewindMusicQueue } from '../rewind-music-queue';

export const applyMusicPlayback = ({
  state,
  command,
  now
}: ApplyMusicPlaybackInput): RoomMusicState | null => {
  const { current, playback } = state;

  if (!current || !playback) {
    return null;
  }

  const isLive = current.source === 'radio';

  return match(command)
    .with({ action: 'play' }, (): RoomMusicState | null => {
      if (playback.status === 'playing') {
        return null;
      }

      const startedAt = isLive ? now : now - playback.positionMs;

      return { ...state, playback: { status: 'playing', startedAt } };
    })
    .with({ action: 'pause' }, (): RoomMusicState | null => {
      if (playback.status === 'paused') {
        return null;
      }

      const positionMs = getMusicPositionMs({ playback, now });

      return { ...state, playback: { status: 'paused', positionMs } };
    })
    .with({ action: 'seek' }, ({ positionMs }): RoomMusicState | null => {
      if (isLive) {
        return null;
      }

      return {
        ...state,
        playback:
          playback.status === 'playing'
            ? { status: 'playing', startedAt: now - positionMs }
            : { status: 'paused', positionMs }
      };
    })
    .with({ action: 'next' }, ({ trackId }) =>
      trackId === current.id ? advanceMusicQueue({ state, now }) : null
    )
    .with({ action: 'previous' }, (): RoomMusicState | null => {
      const positionMs = getMusicPositionMs({ playback, now });
      const shouldRestart =
        state.history.length === 0 || (!isLive && positionMs > MUSIC.history.restartAfterMs);

      if (!shouldRestart) {
        return rewindMusicQueue({ state, now });
      }

      if (isLive) {
        return null;
      }

      return {
        ...state,
        playback:
          playback.status === 'playing'
            ? { status: 'playing', startedAt: now }
            : { status: 'paused', positionMs: 0 }
      };
    })
    .with({ action: 'stop' }, (): RoomMusicState => EMPTY_ROOM_MUSIC)
    .exhaustive();
};

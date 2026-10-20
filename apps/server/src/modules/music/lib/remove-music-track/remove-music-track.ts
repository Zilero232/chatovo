import type { RoomMusicState } from '../../music.types';
import type { RemoveMusicTrackInput } from './remove-music-track.types';

import { advanceMusicQueue } from '../advance-music-queue';

export const removeMusicTrack = ({
  state,
  trackId,
  now
}: RemoveMusicTrackInput): RoomMusicState | null => {
  if (state.current?.id === trackId) {
    return advanceMusicQueue({ state, now, remember: false });
  }

  const queue = state.queue.filter((track) => track.id !== trackId);

  return queue.length === state.queue.length ? null : { ...state, queue };
};

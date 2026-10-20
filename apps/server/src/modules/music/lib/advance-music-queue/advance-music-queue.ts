import type { RoomMusicState } from '../../music.types';
import type { AdvanceMusicQueueInput } from './advance-music-queue.types';

import { EMPTY_ROOM_MUSIC, MUSIC } from '../../config';

export const advanceMusicQueue = ({
  state,
  now,
  remember = true
}: AdvanceMusicQueueInput): RoomMusicState => {
  const [next, ...rest] = state.queue;
  const history =
    remember && state.current
      ? [...state.history, state.current].slice(-MUSIC.history.maxLength)
      : state.history;

  if (!next) {
    return { ...EMPTY_ROOM_MUSIC, history };
  }

  return { current: next, playback: { status: 'playing', startedAt: now }, queue: rest, history };
};

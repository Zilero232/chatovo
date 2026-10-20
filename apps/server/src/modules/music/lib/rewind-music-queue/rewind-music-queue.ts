import type { RoomMusicState } from '../../music.types';
import type { RewindMusicQueueInput } from './rewind-music-queue.types';

export const rewindMusicQueue = ({ state, now }: RewindMusicQueueInput): RoomMusicState => {
  const previous = state.history.at(-1);

  if (!previous) {
    return state;
  }

  return {
    current: previous,
    playback: { status: 'playing', startedAt: now },
    queue: state.current ? [state.current, ...state.queue] : state.queue,
    history: state.history.slice(0, -1)
  };
};

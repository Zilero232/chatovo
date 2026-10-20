import type { RoomMusicState } from '../../music.types';
import type { EnqueueMusicTrackInput } from './enqueue-music-track.types';

export const enqueueMusicTrack = ({
  state,
  track,
  now
}: EnqueueMusicTrackInput): RoomMusicState => {
  if (!state.current) {
    return { ...state, current: track, playback: { status: 'playing', startedAt: now } };
  }

  return { ...state, queue: [...state.queue, track] };
};

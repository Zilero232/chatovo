import type { MusicPlayerAdapter } from '../../../lib';
import type { MusicTrackPlayback } from '../../types';

export type UseMusicPlayerInput = MusicTrackPlayback & {
  adapter: MusicPlayerAdapter | null;
};

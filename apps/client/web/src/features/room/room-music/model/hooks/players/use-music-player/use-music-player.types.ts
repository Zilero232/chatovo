import type { MusicPlayerAdapter } from '../../../../lib/index';
import type { MusicTrackPlayback } from '../../../types';

export type UseMusicPlayerInput = MusicTrackPlayback & {
  adapter: MusicPlayerAdapter | null;
};

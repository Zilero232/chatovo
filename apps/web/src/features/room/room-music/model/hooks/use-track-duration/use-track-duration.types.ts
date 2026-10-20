import type { MusicPlayerAdapter } from '../../../lib';

export type UseTrackDurationInput = {
  adapter: MusicPlayerAdapter | null;
  trackId: string;
};

import type { MusicPlayerAdapter } from '../../../../lib/index';

export type UseTrackDurationInput = {
  adapter: MusicPlayerAdapter | null;
  trackId: string;
};

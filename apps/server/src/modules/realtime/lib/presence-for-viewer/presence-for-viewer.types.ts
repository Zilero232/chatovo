import type { PresenceSnapshots } from '../../realtime.types';

export type PresenceForViewerInput = {
  canSeeInvisible: boolean;
  snapshots: PresenceSnapshots;
  userId: string;
};

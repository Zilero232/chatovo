import type { BadgeId } from '@chatovo/schemas';

import type { TierProgress } from '../../../lib/get-tier-progress';

export type BadgeProgressRowProps = {
  id: BadgeId;
  tier: number;
  progress: TierProgress;
};

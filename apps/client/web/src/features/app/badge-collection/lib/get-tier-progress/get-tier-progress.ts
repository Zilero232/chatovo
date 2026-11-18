import { BADGE_TIERS } from '@chatovo/schemas';

import type { GetTierProgressInput, TierProgress } from './get-tier-progress.types';

export const getTierProgress = ({ id, value, tier }: GetTierProgressInput): TierProgress => {
  const tiers = BADGE_TIERS[id];
  const floor = tier > 0 ? tiers[tier - 1] : 0;
  const goal = tiers.at(tier);

  if (goal === undefined) {
    return { percent: 100, remaining: 0, nextTier: null };
  }

  const percent = Math.round(((value - floor) / (goal - floor)) * 100);

  return {
    percent: Math.min(Math.max(percent, 0), 100),
    remaining: goal - value,
    nextTier: tier + 1
  };
};

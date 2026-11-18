import type { BadgeId } from '@chatovo/schemas';

export type GetTierProgressInput = {
  id: BadgeId;
  value: number;
  tier: number;
};

export type TierProgress = {
  percent: number;
  remaining: number;
  nextTier: number | null;
};

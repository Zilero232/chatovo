import type { BadgeId } from './types';

import { BADGE_TIERS } from './catalog';

type BadgeValueInput = {
  id: BadgeId;
  value: number;
};

type BadgeNextGoal = {
  goal: number;
  remaining: number;
};

/** How many tiers a value has reached: 0 means the badge is not earned yet. */
export const getBadgeTier = ({ id, value }: BadgeValueInput): number =>
  BADGE_TIERS[id].filter((threshold) => value >= threshold).length;

/** The next threshold and how far it is, or null once the top tier is reached. */
export const getBadgeNextGoal = ({ id, value }: BadgeValueInput): BadgeNextGoal | null => {
  const goal = BADGE_TIERS[id].find((threshold) => value < threshold);

  return goal === undefined ? null : { goal, remaining: goal - value };
};

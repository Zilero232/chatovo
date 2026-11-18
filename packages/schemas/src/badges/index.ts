export { BADGE_IDS, BADGE_TIER_NAMES, BADGE_TIERS, badgeIdSchema } from './catalog';
export { getBadgeNextGoal, getBadgeTier } from './lib';
export {
  badgeProgressListSchema,
  badgeProgressSchema,
  earnedBadgeListSchema,
  earnedBadgeSchema
} from './outputs';

export type {
  BadgeId,
  BadgeProgress,
  BadgeProgressList,
  EarnedBadge,
  EarnedBadgeList
} from './types';

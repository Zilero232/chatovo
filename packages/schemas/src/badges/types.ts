import type { z } from 'zod';

import type { badgeIdSchema } from './catalog';
import type {
  badgeProgressListSchema,
  badgeProgressSchema,
  earnedBadgeListSchema,
  earnedBadgeSchema
} from './outputs';

export type BadgeId = z.infer<typeof badgeIdSchema>;
export type BadgeProgress = z.infer<typeof badgeProgressSchema>;
export type BadgeProgressList = z.infer<typeof badgeProgressListSchema>;
export type EarnedBadge = z.infer<typeof earnedBadgeSchema>;
export type EarnedBadgeList = z.infer<typeof earnedBadgeListSchema>;

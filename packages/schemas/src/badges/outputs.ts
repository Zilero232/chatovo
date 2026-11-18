import { z } from 'zod';

import { badgeIdSchema } from './catalog';

export const badgeProgressSchema = z.object({
  id: badgeIdSchema,
  value: z.number().int().nonnegative(),
  tier: z.number().int().nonnegative()
});

export const badgeProgressListSchema = z.array(badgeProgressSchema);

export const earnedBadgeSchema = badgeProgressSchema.pick({ id: true, tier: true });

export const earnedBadgeListSchema = z.array(earnedBadgeSchema);

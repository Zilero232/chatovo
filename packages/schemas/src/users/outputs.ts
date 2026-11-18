import { z } from 'zod';

import { equippedCosmeticsSchema } from '../shop/outputs';

export const userProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  friendTag: z.string(),
  avatarUrl: z.string().nullable().default(null),
  profileUrl: z.string().nullable().default(null),
  bannerColor: z.string().nullable().default(null),
  bio: z.string().nullable().default(null),
  cosmetics: equippedCosmeticsSchema.prefault({}),
  verified: z.boolean().default(false),
  developer: z.boolean().default(false)
});

export const developerListSchema = z.array(userProfileSchema);

import { z } from 'zod';

export const BADGE_IDS = [
  'supporter',
  'veteran',
  'social',
  'chatter',
  'host',
  'collector',
  'talker',
  'penPal',
  'wanderer',
  'sharer',
  'regular',
  'stylist'
] as const;

export const badgeIdSchema = z.enum(BADGE_IDS);

/** What each tier asks for, ascending; the unit is in the `badges.items.<id>.unit` message (days, friends…). */
export const BADGE_TIERS: Record<z.infer<typeof badgeIdSchema>, readonly number[]> = {
  supporter: [1, 3, 5, 10],
  veteran: [7, 30, 90, 180, 365, 730, 1095],
  social: [1, 3, 5, 10, 25, 50, 100],
  chatter: [10, 50, 100, 500, 1000, 5000, 10_000, 25_000],
  host: [1, 3, 5, 10, 25, 50],
  collector: [1, 4, 8, 12, 16, 24, 32],
  talker: [10, 60, 180, 600, 1500, 3000, 6000, 12_000],
  penPal: [1, 3, 5, 10, 20, 35, 50],
  wanderer: [1, 3, 5, 10, 20, 35, 50, 100],
  sharer: [1, 10, 25, 50, 100, 250, 500, 1000],
  regular: [3, 7, 14, 30, 60, 100, 200, 365],
  stylist: [1, 3, 5]
};

/** Shared tier names, one per ladder step; a badge uses as many as it has tiers. */
export const BADGE_TIER_NAMES = [
  'rookie',
  'amateur',
  'active',
  'adept',
  'master',
  'expert',
  'star',
  'legend'
] as const;

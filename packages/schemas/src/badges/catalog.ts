import { z } from 'zod';

export const BADGE_IDS = [
  'supporter',
  'veteran',
  'social',
  'chatter',
  'host',
  'collector'
] as const;

export const badgeIdSchema = z.enum(BADGE_IDS);

/** What each tier asks for, ascending; the unit is in the `badges.items.<id>.unit` message (days, friends…). */
export const BADGE_TIERS: Record<z.infer<typeof badgeIdSchema>, readonly number[]> = {
  supporter: [1, 3, 5, 10],
  veteran: [7, 30, 90, 180, 365, 730, 1095],
  social: [1, 3, 5, 10, 25, 50, 100],
  chatter: [10, 50, 100, 500, 1000, 5000, 10_000, 25_000],
  host: [1, 3, 5, 10, 25, 50],
  collector: [1, 4, 8, 12, 16, 24, 32]
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

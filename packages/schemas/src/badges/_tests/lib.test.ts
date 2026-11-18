import { describe, expect, it } from 'vitest';

import { BADGE_TIER_NAMES, BADGE_TIERS } from '../catalog';
import { getBadgeNextGoal, getBadgeTier } from '../lib';

describe('getBadgeTier', () => {
  it('is 0 below the first threshold', () => {
    expect(getBadgeTier({ id: 'social', value: 0 })).toBe(0);
  });

  it('reaches a tier exactly at its threshold', () => {
    expect(getBadgeTier({ id: 'social', value: 10 })).toBe(4);
  });

  it('stops at the top tier', () => {
    expect(getBadgeTier({ id: 'chatter', value: 99_999 })).toBe(8);
  });
});

describe('BADGE_TIERS', () => {
  it('never has more tiers than there are tier names', () => {
    expect(
      Math.max(...Object.values(BADGE_TIERS).map((tiers) => tiers.length))
    ).toBeLessThanOrEqual(BADGE_TIER_NAMES.length);
  });
});

describe('getBadgeNextGoal', () => {
  it('points at the next threshold with what is left', () => {
    expect(getBadgeNextGoal({ id: 'host', value: 3 })).toEqual({ goal: 5, remaining: 2 });
  });

  it('is null once every tier is reached', () => {
    expect(getBadgeNextGoal({ id: 'supporter', value: 10 })).toBeNull();
  });
});

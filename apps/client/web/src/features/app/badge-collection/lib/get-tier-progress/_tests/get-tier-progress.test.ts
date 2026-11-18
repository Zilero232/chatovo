import { describe, expect, it } from 'vitest';

import { getTierProgress } from '../get-tier-progress';

describe('getTierProgress', () => {
  it('measures progress from zero before the first tier', () => {
    expect(getTierProgress({ id: 'host', value: 0, tier: 0 })).toEqual({
      percent: 0,
      remaining: 1,
      nextTier: 1
    });
  });

  it('measures progress between the current and the next threshold', () => {
    expect(getTierProgress({ id: 'social', value: 7, tier: 3 })).toEqual({
      percent: 40,
      remaining: 3,
      nextTier: 4
    });
  });

  it('is full with no next tier at the top of the ladder', () => {
    expect(getTierProgress({ id: 'supporter', value: 12, tier: 4 })).toEqual({
      percent: 100,
      remaining: 0,
      nextTier: null
    });
  });
});

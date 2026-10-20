import { describe, expect, it } from 'vitest';

import { sumTrendPoints } from '../sum-trend-points';

describe('sumTrendPoints', () => {
  it('adds every point', () => {
    expect(sumTrendPoints([{ count: 2 }, { count: 6 }, { count: 4 }])).toBe(12);
  });

  it('returns zero for an empty series rather than NaN', () => {
    expect(sumTrendPoints([])).toBe(0);
  });

  it('handles an all-zero series', () => {
    expect(sumTrendPoints([{ count: 0 }, { count: 0 }])).toBe(0);
  });
});

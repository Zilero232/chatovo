import { describe, expect, it } from 'vitest';

import { toGradientStops } from '../to-gradient-stops';

describe('toGradientStops', () => {
  it('spreads three colours across the full range', () => {
    expect(toGradientStops(['#a', '#b', '#c']).map(({ offset }) => offset)).toEqual([
      '0%',
      '50%',
      '100%'
    ]);
  });

  it('keeps a single colour at the start', () => {
    expect(toGradientStops(['#a'])).toEqual([{ color: '#a', offset: '0%' }]);
  });
});

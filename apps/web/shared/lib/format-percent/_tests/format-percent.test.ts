import { describe, expect, it } from 'vitest';

import { formatPercent } from '../format-percent';

describe('formatPercent', () => {
  it('formats a ratio as a rounded percentage', () => {
    expect(formatPercent(0)).toBe('0%');
    expect(formatPercent(0.5)).toBe('50%');
    expect(formatPercent(1)).toBe('100%');
  });

  it('rounds to the nearest whole percent', () => {
    expect(formatPercent(0.126)).toBe('13%');
    expect(formatPercent(0.124)).toBe('12%');
  });

  it('clamps values outside 0..1', () => {
    expect(formatPercent(-3)).toBe('0%');
    expect(formatPercent(42)).toBe('100%');
  });
});

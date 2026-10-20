import { describe, expect, it } from 'vitest';

import { formatBadgeCount } from '../format-count';

describe('formatBadgeCount', () => {
  it('renders a small count as is', () => {
    expect(formatBadgeCount(0)).toBe('0');
    expect(formatBadgeCount(7)).toBe('7');
  });

  it('renders the last exact count without a suffix', () => {
    expect(formatBadgeCount(99)).toBe('99');
  });

  it('caps anything above the limit', () => {
    expect(formatBadgeCount(100)).toBe('99+');
    expect(formatBadgeCount(4321)).toBe('99+');
  });
});

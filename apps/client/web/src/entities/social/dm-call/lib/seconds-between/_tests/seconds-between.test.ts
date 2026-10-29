import { describe, expect, it } from 'vitest';

import { secondsBetween } from '../seconds-between';

const START = '2026-10-29T10:00:00.000Z';

describe('secondsBetween', () => {
  it('counts whole seconds between two moments', () => {
    expect(secondsBetween({ from: START, to: Date.parse(START) + 61_900 })).toBe(61);
  });

  it('never goes below zero when the clocks disagree', () => {
    expect(secondsBetween({ from: START, to: Date.parse(START) - 5000 })).toBe(0);
  });

  it('is null without a start or for an unreadable date', () => {
    expect(secondsBetween({ from: null, to: START })).toBeNull();
    expect(secondsBetween({ from: 'later', to: START })).toBeNull();
  });
});

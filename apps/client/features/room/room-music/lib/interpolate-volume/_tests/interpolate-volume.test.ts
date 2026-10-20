import { describe, expect, it } from 'vitest';

import { interpolateVolume } from '../interpolate-volume';

describe('interpolateVolume', () => {
  it('starts at the source volume', () => {
    expect(interpolateVolume({ from: 0.8, to: 0.2, elapsedMs: 0, durationMs: 250 })).toBe(0.8);
  });

  it('moves linearly towards the target', () => {
    expect(interpolateVolume({ from: 0, to: 1, elapsedMs: 100, durationMs: 400 })).toBe(0.25);
  });

  it('stops at the target once the ramp is over', () => {
    expect(interpolateVolume({ from: 1, to: 0.25, elapsedMs: 5_000, durationMs: 250 })).toBe(0.25);
  });

  it('jumps straight to the target when the ramp has no duration', () => {
    expect(interpolateVolume({ from: 0, to: 0.6, elapsedMs: 0, durationMs: 0 })).toBe(0.6);
  });
});

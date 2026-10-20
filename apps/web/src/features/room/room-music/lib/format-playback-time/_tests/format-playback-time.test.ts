import { describe, expect, it } from 'vitest';

import { formatPlaybackTime } from '../format-playback-time';

describe('formatPlaybackTime', () => {
  it('shows minutes and zero-padded seconds', () => {
    expect(formatPlaybackTime(65_400)).toBe('1:05');
  });

  it('adds hours for long tracks', () => {
    expect(formatPlaybackTime(3_725_000)).toBe('1:02:05');
  });

  it('never goes below zero', () => {
    expect(formatPlaybackTime(-500)).toBe('0:00');
  });
});

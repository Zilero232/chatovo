import { describe, expect, it } from 'vitest';

import { formatCallDuration } from '../format-call-duration';

describe('formatCallDuration', () => {
  it('pads the seconds of a short call', () => {
    expect(formatCallDuration(5)).toBe('0:05');
  });

  it('shows minutes without an hour part under an hour', () => {
    expect(formatCallDuration(754)).toBe('12:34');
  });

  it('adds the hour part from an hour on', () => {
    expect(formatCallDuration(3600 + 62)).toBe('1:01:02');
  });

  it('drops fractions and treats a negative value as zero', () => {
    expect(formatCallDuration(59.9)).toBe('0:59');
    expect(formatCallDuration(-3)).toBe('0:00');
  });
});

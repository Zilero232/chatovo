import { hoursToMilliseconds, minutesToMilliseconds } from 'date-fns';
import { describe, expect, it } from 'vitest';

import { formatVoiceDuration } from '../format-voice-duration';

describe('formatVoiceDuration', () => {
  it('reads a session shorter than a minute as «меньше минуты»', () => {
    expect(formatVoiceDuration(40_000)).toBe('меньше минуты');
    expect(formatVoiceDuration(-5)).toBe('меньше минуты');
  });

  it('declines minutes and hours in Russian', () => {
    expect(formatVoiceDuration(minutesToMilliseconds(5))).toBe('5 минут');
    expect(formatVoiceDuration(hoursToMilliseconds(1) + minutesToMilliseconds(2))).toBe(
      '1 час 2 минуты'
    );
    expect(formatVoiceDuration(hoursToMilliseconds(3))).toBe('3 часа');
  });
});

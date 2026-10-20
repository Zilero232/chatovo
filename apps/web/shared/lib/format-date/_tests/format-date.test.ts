import { describe, expect, it } from 'vitest';

import { formatDateTime, formatDay } from '../format-date';

describe('formatDateTime', () => {
  it('always shows the year, unlike the relative chat formatter', () => {
    expect(formatDateTime('2026-09-03T12:30:00.000Z')).toContain('2026');
  });

  it('keeps day, month and time in one label', () => {
    expect(formatDateTime('2026-09-03T12:30:00.000Z')).toMatch(
      /^\d{1,2} \w{3} \d{4}, \d{2}:\d{2}$/
    );
  });

  it('does not fall back to a relative word for today', () => {
    expect(formatDateTime(new Date().toISOString())).not.toMatch(/today|yesterday/i);
  });
});

describe('formatDay', () => {
  it('formats an ISO day as a short label', () => {
    expect(formatDay('2026-09-03')).toBe('3 Sep');
  });

  it('returns an empty string for a missing date so the axis stays blank', () => {
    expect(formatDay('')).toBe('');
  });

  it('keeps the calendar day, not the UTC shift', () => {
    expect(formatDay('2026-01-01')).toBe('1 Jan');
  });
});

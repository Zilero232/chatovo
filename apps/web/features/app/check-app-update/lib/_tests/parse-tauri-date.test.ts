import { describe, expect, it } from 'vitest';

import { parseTauriDate } from '../parse-tauri-date';

describe('parseTauriDate', () => {
  it('parses the space-separated format the Tauri updater emits', () => {
    const parsed = parseTauriDate('2026-09-03 12:30:00.000 +00:00');

    expect(parsed).toBeInstanceOf(Date);
    expect(parsed?.getUTCFullYear()).toBe(2026);
  });

  it('falls back to ISO when the release feed used the standard format', () => {
    const parsed = parseTauriDate('2026-09-03T12:30:00.000Z');

    expect(parsed?.toISOString()).toBe('2026-09-03T12:30:00.000Z');
  });

  it('returns null for a missing date rather than an Invalid Date', () => {
    expect(parseTauriDate(null)).toBeNull();
    expect(parseTauriDate(undefined)).toBeNull();
    expect(parseTauriDate('')).toBeNull();
  });

  it('returns null for a string that is not a date at all', () => {
    expect(parseTauriDate('soon')).toBeNull();
  });
});

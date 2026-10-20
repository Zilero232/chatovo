import { describe, expect, it } from 'vitest';

import { normalizeMessage } from '../normalize-message';

describe('normalizeMessage', () => {
  it('strips trailing spaces that would render as a ragged line', () => {
    expect(normalizeMessage('hello   \nworld')).toBe('hello\nworld');
  });

  it('collapses a run of blank lines into one break', () => {
    expect(normalizeMessage('a\n\n\n\nb')).toBe('a\nb');
  });

  it('trims the message so leading padding does not shift the bubble', () => {
    expect(normalizeMessage('  \n hi \n  ')).toBe('hi');
  });

  it('keeps a single line break, which is a deliberate paragraph split', () => {
    expect(normalizeMessage('a\nb')).toBe('a\nb');
  });

  it('returns an empty string for whitespace-only input', () => {
    expect(normalizeMessage('   \n\n  ')).toBe('');
  });
});

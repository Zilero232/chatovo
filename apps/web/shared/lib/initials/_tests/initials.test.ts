import { describe, expect, it } from 'vitest';

import { getAvatarColor, getInitials } from '../initials';

describe('getInitials', () => {
  it('takes the first letter of the first two words', () => {
    expect(getInitials('Alexandr Artemev')).toBe('AA');
  });

  it('uppercases lowercase input', () => {
    expect(getInitials('alex')).toBe('A');
  });

  it('ignores words past the second', () => {
    expect(getInitials('Jean Claude Van Damme')).toBe('JC');
  });

  it('collapses repeated whitespace', () => {
    expect(getInitials('  Ada   Lovelace  ')).toBe('AL');
  });

  it('returns a placeholder for blank input', () => {
    expect(getInitials('')).toBe('?');
    expect(getInitials('   ')).toBe('?');
  });

  it('handles non-latin names', () => {
    expect(getInitials('Алексей Петров')).toBe('АП');
  });
});

describe('getAvatarColor', () => {
  it('is stable for the same name', () => {
    expect(getAvatarColor('Alexandr')).toBe(getAvatarColor('Alexandr'));
  });

  it('returns a valid hsl string', () => {
    expect(getAvatarColor('Alexandr')).toMatch(/^hsl\(\d{1,3} 55% 45%\)$/);
  });

  it('stays in range for an empty name', () => {
    expect(getAvatarColor('')).toMatch(/^hsl\(\d{1,3} 55% 45%\)$/);
  });
});

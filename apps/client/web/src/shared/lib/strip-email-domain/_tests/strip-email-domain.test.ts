import { describe, expect, it } from 'vitest';

import { stripEmailDomain } from '../strip-email-domain';

describe('stripEmailDomain', () => {
  it('keeps only the local part of an email', () => {
    expect(stripEmailDomain('alexandr.artemev.me@gmail.com')).toBe('alexandr.artemev.me');
  });

  it('leaves a plain name untouched', () => {
    expect(stripEmailDomain('alex')).toBe('alex');
  });

  it('returns null for nullish input', () => {
    expect(stripEmailDomain(null)).toBeNull();
    expect(stripEmailDomain(undefined)).toBeNull();
  });

  it('returns null when the local part is blank', () => {
    expect(stripEmailDomain('@gmail.com')).toBeNull();
    expect(stripEmailDomain('   @gmail.com')).toBeNull();
    expect(stripEmailDomain('')).toBeNull();
  });

  it('trims surrounding whitespace', () => {
    expect(stripEmailDomain('  alex@mail.ru  ')).toBe('alex');
  });
});

import { describe, expect, it } from 'vitest';

import { firstNonEmpty } from '../first-non-empty';

describe('firstNonEmpty', () => {
  it('returns the first non-blank value', () => {
    expect(firstNonEmpty(null, '', '  ', 'Alex', 'Bob')).toBe('Alex');
  });

  it('trims the value it returns', () => {
    expect(firstNonEmpty('  Alex  ')).toBe('Alex');
  });

  it('skips nullish entries', () => {
    expect(firstNonEmpty(undefined, null, 'Alex')).toBe('Alex');
  });

  it('returns null when nothing qualifies', () => {
    expect(firstNonEmpty(null, undefined, '', '   ')).toBeNull();
  });

  it('returns null for no arguments', () => {
    expect(firstNonEmpty()).toBeNull();
  });
});

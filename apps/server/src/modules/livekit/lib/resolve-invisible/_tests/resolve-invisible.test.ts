import { describe, expect, it } from 'vitest';

import { resolveInvisible } from '../resolve-invisible';

describe('resolveInvisible', () => {
  it('lets a staff member who asked be invisible', () => {
    expect(resolveInvisible({ requested: true, canBeInvisible: true })).toBe(true);
  });

  it('refuses a plain user who forged the flag — the core security guarantee', () => {
    expect(resolveInvisible({ requested: true, canBeInvisible: false })).toBe(false);
  });

  it('keeps staff visible when they did not ask', () => {
    expect(resolveInvisible({ requested: false, canBeInvisible: true })).toBe(false);
  });

  it('treats a missing flag as not requested', () => {
    expect(resolveInvisible({ canBeInvisible: true })).toBe(false);
  });

  it('is false for a plain user by default', () => {
    expect(resolveInvisible({ canBeInvisible: false })).toBe(false);
  });
});

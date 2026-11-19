import { describe, expect, it } from 'vitest';

import { countFilledProfileFields } from '../count-filled-profile-fields';

const EMPTY_PROFILE = {
  displayName: null,
  avatarUrl: null,
  profileUrl: null,
  bannerColor: null,
  bio: null
};

describe('countFilledProfileFields', () => {
  it('is 0 without a profile', () => {
    expect(countFilledProfileFields(null)).toBe(0);
  });

  it('counts only the fields that hold text', () => {
    expect(
      countFilledProfileFields({ ...EMPTY_PROFILE, displayName: 'Chato', bio: 'hi', avatarUrl: '' })
    ).toBe(2);
  });

  it('ignores whitespace-only values', () => {
    expect(countFilledProfileFields({ ...EMPTY_PROFILE, bio: '   ' })).toBe(0);
  });
});

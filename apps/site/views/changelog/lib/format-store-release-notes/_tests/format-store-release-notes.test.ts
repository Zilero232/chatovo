import { describe, expect, it } from 'vitest';

import { formatStoreReleaseNotes } from '../format-store-release-notes';

describe('formatStoreReleaseNotes', () => {
  it('puts each title on its own bulleted line', () => {
    expect(formatStoreReleaseNotes({ titles: ['One', 'Two'], limit: 500 })).toBe('• One\n• Two');
  });

  it('drops the titles that would overflow the store limit', () => {
    expect(formatStoreReleaseNotes({ titles: ['One', 'Two'], limit: 10 })).toBe('• One');
  });

  it('returns an empty string when nothing fits', () => {
    expect(formatStoreReleaseNotes({ titles: ['A long title'], limit: 5 })).toBe('');
  });
});

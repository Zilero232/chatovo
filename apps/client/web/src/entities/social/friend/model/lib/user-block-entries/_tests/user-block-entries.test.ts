import type { UserBlockEntry } from '@chatovo/schemas';

import { describe, expect, it } from 'vitest';

import { addUserBlockEntry, removeUserBlockEntry, toBlockedUserIds } from '../user-block-entries';

const entryFor = (id: string, blockedAt = '2026-10-21T10:00:00.000Z'): UserBlockEntry => ({
  user: {
    id,
    name: id,
    friendTag: `${id}#0001`,
    avatarUrl: null,
    verified: false,
    developer: false,
    isOnline: false
  },
  blockedAt
});

const ALEX = entryFor('alex');
const SAM = entryFor('sam');

describe('addUserBlockEntry', () => {
  it('puts the fresh block first, as the server orders the list', () => {
    expect(addUserBlockEntry({ entries: [ALEX], entry: SAM })).toEqual([SAM, ALEX]);
  });

  it('replaces an existing entry for the same user instead of listing them twice', () => {
    const again = entryFor('alex', '2026-10-21T11:00:00.000Z');

    expect(addUserBlockEntry({ entries: [ALEX, SAM], entry: again })).toEqual([again, SAM]);
  });

  it('leaves a list that was never loaded untouched so it is fetched in full', () => {
    expect(addUserBlockEntry({ entries: undefined, entry: ALEX })).toBeUndefined();
  });
});

describe('removeUserBlockEntry', () => {
  it('drops only the unblocked user', () => {
    expect(removeUserBlockEntry({ entries: [ALEX, SAM], userId: 'alex' })).toEqual([SAM]);
  });

  it('leaves a list that was never loaded untouched', () => {
    expect(removeUserBlockEntry({ entries: undefined, userId: 'alex' })).toBeUndefined();
  });
});

describe('toBlockedUserIds', () => {
  it('collects the blocked user ids for a membership check', () => {
    const ids = toBlockedUserIds([ALEX, SAM]);

    expect(ids.has('alex')).toBe(true);
    expect(ids.has('kim')).toBe(false);
  });

  it('is empty for an empty list', () => {
    expect(toBlockedUserIds([]).size).toBe(0);
  });
});

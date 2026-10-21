import { describe, expect, it, vi } from 'vitest';

vi.mock('../../realtime', () => ({
  hasUserConnection: () => true
}));

const { toFriendUser, toUserBlockEntry, normalizeFriendTag } = await import('../mappers');

const USER = {
  id: 'user-them',
  name: 'Sam',
  image: null,
  verified: false,
  role: 'user',
  friendTag: 'sam#0001',
  profile: null
} as never;

describe('toUserBlockEntry', () => {
  it('never reports whether a blocked user is online, even while they are connected', () => {
    expect(toFriendUser(USER).isOnline).toBe(true);
    expect(
      toUserBlockEntry({ blocked: USER, createdAt: new Date('2026-10-21T10:00:00.000Z') })
    ).toEqual({
      user: expect.objectContaining({ id: 'user-them', isOnline: false }),
      blockedAt: '2026-10-21T10:00:00.000Z'
    });
  });
});

describe('normalizeFriendTag', () => {
  it('lowercases the tag so lookups are case-insensitive', () => {
    expect(normalizeFriendTag('Alex#4821')).toBe('alex#4821');
    expect(normalizeFriendTag('ALEX#4821')).toBe('alex#4821');
  });

  it('trims surrounding whitespace from a pasted tag', () => {
    expect(normalizeFriendTag('  alex#4821  ')).toBe('alex#4821');
  });

  it('keeps the discriminator intact', () => {
    expect(normalizeFriendTag('alex#0001')).toBe('alex#0001');
  });

  it('leaves an already-normalized tag unchanged', () => {
    expect(normalizeFriendTag('alex#4821')).toBe('alex#4821');
  });

  it('handles an empty string', () => {
    expect(normalizeFriendTag('   ')).toBe('');
  });
});

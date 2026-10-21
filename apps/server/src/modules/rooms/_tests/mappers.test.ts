import { describe, expect, it } from 'vitest';

import { toRoomBan } from '../mappers';

const BANNED_AT = new Date('2026-10-21T10:00:00.000Z');

const user = {
  id: 'user-1',
  name: 'troll@example.com',
  email: 'troll@example.com',
  friendTag: 'troll',
  emailVerified: true,
  image: null,
  role: 'user',
  verified: false,
  banned: false,
  banReason: null,
  banExpires: null,
  bannedAt: null,
  bannedById: null,
  createdAt: BANNED_AT,
  updatedAt: BANNED_AT,
  profile: null
};

describe('toRoomBan', () => {
  it('exposes only the public face of the banned user, never their email', () => {
    expect(toRoomBan({ user, createdAt: BANNED_AT })).toEqual({
      user: { id: 'user-1', name: 'troll', avatarUrl: null },
      bannedAt: '2026-10-21T10:00:00.000Z'
    });
  });
});

import { describe, expect, it } from 'vitest';

import { assertModerationTarget } from '../assert-moderation-target';

const OWNER = 'owner-1';
const ADMIN = 'admin-1';
const GUEST = 'guest-1';

const codeOf = (call: () => void): string => {
  try {
    call();
  } catch (error) {
    return (error as { getResponse: () => { code: string } }).getResponse().code;
  }

  throw new Error('expected the call to throw');
};

describe('assertModerationTarget', () => {
  it('lets the owner moderate a regular participant', () => {
    expect(() =>
      assertModerationTarget({
        actorId: OWNER,
        actorRole: 'user',
        ownerId: OWNER,
        targetId: GUEST,
        targetRole: 'user'
      })
    ).not.toThrow();
  });

  it('lets an admin moderate a regular participant of somebody else’s room', () => {
    expect(() =>
      assertModerationTarget({
        actorId: ADMIN,
        actorRole: 'admin',
        ownerId: OWNER,
        targetId: GUEST,
        targetRole: 'user'
      })
    ).not.toThrow();
  });

  it('refuses to let the owner moderate themselves', () => {
    expect(
      codeOf(() =>
        assertModerationTarget({
          actorId: OWNER,
          actorRole: 'user',
          ownerId: OWNER,
          targetId: OWNER,
          targetRole: 'user'
        })
      )
    ).toBe('ROOM_MODERATION_TARGET_PROTECTED');
  });

  it('refuses to let an admin moderate the room owner', () => {
    expect(
      codeOf(() =>
        assertModerationTarget({
          actorId: ADMIN,
          actorRole: 'admin',
          ownerId: OWNER,
          targetId: OWNER,
          targetRole: 'user'
        })
      )
    ).toBe('ROOM_MODERATION_TARGET_PROTECTED');
  });

  it('refuses to let the owner moderate an app admin, invisible or not', () => {
    expect(
      codeOf(() =>
        assertModerationTarget({
          actorId: OWNER,
          actorRole: 'user',
          ownerId: OWNER,
          targetId: ADMIN,
          targetRole: 'admin'
        })
      )
    ).toBe('ROOM_MODERATION_TARGET_PROTECTED');
  });

  it('refuses a moderator acting on an admin, who outranks them', () => {
    expect(
      codeOf(() =>
        assertModerationTarget({
          actorId: 'moderator-1',
          actorRole: 'moderator',
          ownerId: OWNER,
          targetId: ADMIN,
          targetRole: 'admin'
        })
      )
    ).toBe('ROOM_MODERATION_TARGET_PROTECTED');
  });

  it('lets an admin act on a moderator, who ranks below them', () => {
    expect(() =>
      assertModerationTarget({
        actorId: ADMIN,
        actorRole: 'admin',
        ownerId: OWNER,
        targetId: 'moderator-1',
        targetRole: 'moderator'
      })
    ).not.toThrow();
  });

  it('keeps the app owner untouchable even for an admin', () => {
    expect(
      codeOf(() =>
        assertModerationTarget({
          actorId: ADMIN,
          actorRole: 'admin',
          ownerId: OWNER,
          targetId: 'app-owner',
          targetRole: 'owner'
        })
      )
    ).toBe('ROOM_MODERATION_TARGET_PROTECTED');
  });
});

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
          ownerId: OWNER,
          targetId: ADMIN,
          targetRole: 'admin'
        })
      )
    ).toBe('ROOM_MODERATION_TARGET_PROTECTED');
  });
});

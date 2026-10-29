import { describe, expect, it } from 'vitest';

import type { AssertCanEditUserInput } from '../assert-can-edit-user.types';

import { assertCanEditUser } from '../assert-can-edit-user';

const codeOf = (input: Partial<AssertCanEditUserInput>): string | null => {
  try {
    assertCanEditUser({
      actorRole: 'admin',
      targetRole: 'user',
      isSelf: false,
      isFlagChange: false,
      ...input
    });
  } catch (error) {
    return (error as { getResponse: () => { code: string } }).getResponse().code;
  }

  return null;
};

describe('assertCanEditUser', () => {
  it('lets an admin promote a plain user to moderator', () => {
    expect(codeOf({ nextRole: 'moderator' })).toBeNull();
  });

  it('refuses an admin handing out the admin role, which only the owner gives', () => {
    expect(codeOf({ nextRole: 'admin' })).toBe('ROLE_NOT_ASSIGNABLE');
  });

  it('lets the owner make an admin', () => {
    expect(codeOf({ actorRole: 'owner', targetRole: 'moderator', nextRole: 'admin' })).toBeNull();
  });

  it('never lets anyone hand out the owner role through the panel', () => {
    expect(codeOf({ actorRole: 'owner', targetRole: 'admin', nextRole: 'owner' })).toBe(
      'ROLE_NOT_ASSIGNABLE'
    );
  });

  it('refuses an admin touching another admin, even just the profile', () => {
    expect(codeOf({ targetRole: 'admin' })).toBe('ROLE_PROTECTED');
  });

  it('refuses an admin touching the owner', () => {
    expect(codeOf({ targetRole: 'owner', nextRole: 'user' })).toBe('ROLE_PROTECTED');
  });

  it('refuses anyone changing their own role', () => {
    expect(
      codeOf({ actorRole: 'owner', targetRole: 'owner', isSelf: true, nextRole: 'admin' })
    ).toBe('BLOCK_SELF');
  });

  it('lets an admin save their own profile with the flags left as they were', () => {
    expect(
      codeOf({ targetRole: 'admin', isSelf: true, nextRole: 'admin', isFlagChange: false })
    ).toBeNull();
  });

  it('keeps an admin from marking their own account verified or DEV', () => {
    expect(codeOf({ targetRole: 'admin', isSelf: true, isFlagChange: true })).toBe(
      'ROLE_PROTECTED'
    );
  });

  it('lets the owner mark their own account', () => {
    expect(
      codeOf({ actorRole: 'owner', targetRole: 'owner', isSelf: true, isFlagChange: true })
    ).toBeNull();
  });

  it('treats resending the current role as no role change', () => {
    expect(codeOf({ targetRole: 'moderator', nextRole: 'moderator' })).toBeNull();
  });
});

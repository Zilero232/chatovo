import { describe, expect, it } from 'vitest';

import { assignableRoles, canActOnRole, hasPermission, roleRank, toUserRole } from '../roles';

describe('toUserRole', () => {
  it('falls back to a plain user for an unknown, empty or missing role', () => {
    expect(toUserRole('superuser')).toBe('user');
    expect(toUserRole('')).toBe('user');
    expect(toUserRole(null)).toBe('user');
    expect(toUserRole(undefined)).toBe('user');
  });
});

describe('roleRank', () => {
  it('orders the hierarchy owner above admin above moderator above user', () => {
    expect(roleRank('owner')).toBeGreaterThan(roleRank('admin'));
    expect(roleRank('admin')).toBeGreaterThan(roleRank('moderator'));
    expect(roleRank('moderator')).toBeGreaterThan(roleRank('user'));
  });
});

describe('hasPermission', () => {
  it('gives a moderator invisible mode and room moderation but not the admin panel', () => {
    expect(hasPermission({ role: 'moderator', permission: 'invisible' })).toBe(true);
    expect(hasPermission({ role: 'moderator', permission: 'moderateAnyRoom' })).toBe(true);
    expect(hasPermission({ role: 'moderator', permission: 'adminPanel' })).toBe(false);
    expect(hasPermission({ role: 'moderator', permission: 'manageRoles' })).toBe(false);
  });

  it('gives a plain user and an unknown role nothing', () => {
    expect(hasPermission({ role: 'user', permission: 'invisible' })).toBe(false);
    expect(hasPermission({ role: 'root', permission: 'adminPanel' })).toBe(false);
  });

  it('gives admins and the owner the admin panel', () => {
    expect(hasPermission({ role: 'admin', permission: 'adminPanel' })).toBe(true);
    expect(hasPermission({ role: 'owner', permission: 'adminPanel' })).toBe(true);
  });
});

describe('canActOnRole', () => {
  it('lets a room owner without a staff role act on a plain user', () => {
    expect(canActOnRole({ actorRole: 'user', targetRole: 'user' })).toBe(true);
  });

  it('protects staff from an equal or lower rank', () => {
    expect(canActOnRole({ actorRole: 'user', targetRole: 'moderator' })).toBe(false);
    expect(canActOnRole({ actorRole: 'admin', targetRole: 'admin' })).toBe(false);
    expect(canActOnRole({ actorRole: 'moderator', targetRole: 'admin' })).toBe(false);
  });

  it('lets a higher rank act on a lower staff role', () => {
    expect(canActOnRole({ actorRole: 'admin', targetRole: 'moderator' })).toBe(true);
    expect(canActOnRole({ actorRole: 'owner', targetRole: 'admin' })).toBe(true);
  });

  it('leaves the owner untouchable by everyone', () => {
    expect(canActOnRole({ actorRole: 'admin', targetRole: 'owner' })).toBe(false);
    expect(canActOnRole({ actorRole: 'owner', targetRole: 'owner' })).toBe(false);
  });
});

describe('assignableRoles', () => {
  it('lets the owner hand out every role below owner but never owner itself', () => {
    expect(assignableRoles('owner')).toEqual(['admin', 'moderator', 'user']);
  });

  it('lets an admin hand out only roles below admin', () => {
    expect(assignableRoles('admin')).toEqual(['moderator', 'user']);
  });

  it('gives a moderator and a plain user nothing to hand out', () => {
    expect(assignableRoles('moderator')).toEqual([]);
    expect(assignableRoles('user')).toEqual([]);
  });
});

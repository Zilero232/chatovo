import type { HasPermissionInput, Permission, RolePairInput, UserRole } from './types';

import { USER_ROLE, userRoleSchema } from './inputs';

const ROLE_RANK: Record<UserRole, number> = {
  user: 0,
  moderator: 1,
  admin: 2,
  owner: 3
};

const STAFF_PERMISSIONS: Permission[] = [
  'moderateAnyRoom',
  'invisible',
  'seeInvisible',
  'bypassRoomBans'
];

const ADMIN_PERMISSIONS: Permission[] = [
  ...STAFF_PERMISSIONS,
  'adminPanel',
  'manageRoles',
  'blockUsers'
];

const ROLE_PERMISSIONS: Record<UserRole, ReadonlySet<Permission>> = {
  user: new Set(),
  moderator: new Set(STAFF_PERMISSIONS),
  admin: new Set(ADMIN_PERMISSIONS),
  owner: new Set(ADMIN_PERMISSIONS)
};

/** Reads a stored role string; anything unknown (a legacy value, a missing user) is a plain user. */
export const toUserRole = (value: string | null | undefined): UserRole =>
  userRoleSchema.safeParse(value).data ?? USER_ROLE.user;

/** The role's place in the hierarchy: user 0, moderator 1, admin 2, owner 3. */
export const roleRank = (value: string | null | undefined): number => ROLE_RANK[toUserRole(value)];

export const isStaffRole = (value: string | null | undefined): boolean => roleRank(value) > 0;

export const STAFF_ROLES: UserRole[] = userRoleSchema.options.filter(isStaffRole);

export const hasPermission = ({ role, permission }: HasPermissionInput): boolean =>
  ROLE_PERMISSIONS[toUserRole(role)].has(permission);

/** Whether the actor may act on the target: anyone on a plain user, only a higher rank on staff. */
export const canActOnRole = ({ actorRole, targetRole }: RolePairInput): boolean => {
  const targetRank = roleRank(targetRole);

  return targetRank === 0 || roleRank(actorRole) > targetRank;
};

/** The roles the actor may hand out: strictly below their own, and never the owner, which only config sets. */
export const assignableRoles = (value: string | null | undefined): UserRole[] => {
  const role = toUserRole(value);

  if (!hasPermission({ role, permission: 'manageRoles' })) {
    return [];
  }

  return userRoleSchema.options.filter(
    (candidate) => candidate !== USER_ROLE.owner && ROLE_RANK[candidate] < ROLE_RANK[role]
  );
};

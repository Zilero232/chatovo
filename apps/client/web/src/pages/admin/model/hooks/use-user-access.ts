import type { AdminUser } from '@chatovo/schemas';

import { assignableRoles, canActOnRole, USER_ROLE } from '@chatovo/schemas';

import { useCurrentUser } from '@/entities/auth/user';

export const useUserAccess = (target: AdminUser) => {
  const { user, role, can } = useCurrentUser();

  const isSelf = user?.id === target.id;
  const canManage = isSelf || canActOnRole({ actorRole: role, targetRole: target.role });
  const roleOptions = assignableRoles(role);

  return {
    canManage,
    canBlock: !isSelf && canManage && can('blockUsers'),
    canEditRole: !isSelf && canManage && roleOptions.includes(target.role),
    canEditFlags: isSelf ? role === USER_ROLE.owner : canManage,
    roleOptions
  };
};

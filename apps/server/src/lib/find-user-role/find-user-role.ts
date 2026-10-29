import type { UserRole } from '@chatovo/schemas';

import { toUserRole } from '@chatovo/schemas';

import { basePrisma as prisma } from '../../core';

/** The user's role read fresh from the database; a missing user or an unknown value is a plain user. */
export const findUserRole = async (userId: string): Promise<UserRole> => {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });

  return toUserRole(user?.role);
};

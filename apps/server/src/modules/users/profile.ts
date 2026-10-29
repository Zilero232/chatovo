import type { UserProfile } from '@chatovo/schemas';

import { isNullish, isString } from 'remeda';

import type { Prisma } from '../../../generated';

const resolveString = (value: unknown): string | null =>
  isString(value) && value.trim().length > 0 ? value.trim() : null;

const stripEmail = (value: string | null): string | null => {
  if (isNullish(value)) {
    return null;
  }

  return resolveString(value.split('@')[0]);
};

export type UserWithProfile = Prisma.UserGetPayload<{ include: { profile: true } }>;

type DisplayNameSource = Partial<Pick<Prisma.UserGetPayload<true>, 'name'>> & {
  displayName?: string | null;
  userId: string;
};

export const resolveDisplayName = ({ displayName, name, userId }: DisplayNameSource): string =>
  stripEmail(resolveString(displayName)) ?? stripEmail(resolveString(name)) ?? userId;

export const toUserProfile = (user: UserWithProfile): UserProfile => {
  const { id, name, image, verified, developer, profile, friendTag } = user;

  return {
    id,
    name: resolveDisplayName({ displayName: profile?.displayName, name, userId: id }),
    friendTag,
    avatarUrl: resolveString(profile?.avatarUrl) ?? resolveString(image),
    profileUrl: resolveString(profile?.profileUrl),
    bannerColor: resolveString(profile?.bannerColor),
    bio: resolveString(profile?.bio),
    verified,
    developer
  };
};

'use client';

import { useCurrentUser, useDevelopers } from '@/entities/auth/user';
import { useFriends } from '@/entities/social/friend';

export const useDevelopersList = () => {
  const { user } = useCurrentUser();

  const { data: allDevelopers, isPending } = useDevelopers();
  const { data: friends } = useFriends();

  const friendIds = new Set((friends ?? []).map((entry) => entry.user.id));

  return {
    isPending,
    developers: allDevelopers?.filter((developer) => developer.id !== user?.id),
    isFriend: (developerId: string) => friendIds.has(developerId)
  };
};

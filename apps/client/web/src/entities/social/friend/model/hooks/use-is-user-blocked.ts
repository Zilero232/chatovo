import { useBlockedUserIds } from './use-blocked-user-ids';

export const useIsUserBlocked = (userId: string) => {
  const blockedIds = useBlockedUserIds();

  return blockedIds.has(userId);
};

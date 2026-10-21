import { toBlockedUserIds } from '../lib';
import { useBlockedUsers } from './use-blocked-users';

export const useBlockedUserIds = () => {
  const { data: entries } = useBlockedUsers();

  return toBlockedUserIds(entries ?? []);
};

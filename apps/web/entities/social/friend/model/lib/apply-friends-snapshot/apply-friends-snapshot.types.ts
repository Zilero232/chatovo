import type { FriendCallStreamSnapshot } from '@chatovo/schemas';
import type { QueryClient } from '@tanstack/react-query';

export type ApplyFriendsSnapshotInput = {
  queryClient: QueryClient;
  snapshot: FriendCallStreamSnapshot;
};

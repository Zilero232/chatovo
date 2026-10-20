import { friendCallStreamSnapshotSchema } from '@chatovo/schemas';

import { QUERY_KEYS } from '@/shared/constants';

import type { ApplyFriendsSnapshotInput } from './apply-friends-snapshot.types';

import { invalidateFriendsQueries } from '../invalidate-friends-queries';

export const applyFriendsSnapshot = ({
  queryClient,
  snapshot
}: ApplyFriendsSnapshotInput): void => {
  const parsed = friendCallStreamSnapshotSchema.safeParse(snapshot);

  if (!parsed.success) {
    return;
  }

  queryClient.setQueryData(QUERY_KEYS.friendCallIncoming(), { call: parsed.data.incoming });
  queryClient.setQueryData(QUERY_KEYS.friendCallOutgoing(), { call: parsed.data.outgoing });

  const epoch = parsed.data.friendsEpoch;
  const knownEpoch = queryClient.getQueryData<number>(QUERY_KEYS.friendsEpoch());

  queryClient.setQueryData(QUERY_KEYS.friendsEpoch(), epoch);

  if (knownEpoch !== undefined && epoch !== knownEpoch) {
    invalidateFriendsQueries(queryClient);
  }
};

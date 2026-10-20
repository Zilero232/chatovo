'use client';

import { useToastError } from '@/entities/app/locale';
import {
  useAcceptFriendRequest,
  useCallFriend,
  useDeclineFriendRequest,
  useRemoveFriendship,
  useSendFriendRequest
} from '@/entities/social/friend';
import { appEvents } from '@/shared/lib';

import type { UseFriendProfileActionsInput } from './use-friend-profile-actions.types';

export const useFriendProfileActions = ({ userId, friendTag }: UseFriendProfileActionsInput) => {
  const toastError = useToastError();

  const sendRequest = useSendFriendRequest();
  const acceptRequest = useAcceptFriendRequest();
  const declineRequest = useDeclineFriendRequest();
  const removeFriendship = useRemoveFriendship();
  const callFriend = useCallFriend();

  const isBusy =
    sendRequest.isPending ||
    acceptRequest.isPending ||
    declineRequest.isPending ||
    removeFriendship.isPending ||
    callFriend.isPending;

  const add = () => {
    sendRequest.mutate(
      { tag: friendTag, relationUserId: userId },
      {
        onError: (err: Error) => toastError(`friend-request-send-${userId}`)(err)
      }
    );
  };

  const cancelRequest = () => {
    removeFriendship.mutate(userId, {
      onError: toastError(`friend-remove-${userId}`)
    });
  };

  const accept = (friendshipId: string) => {
    acceptRequest.mutate(
      { friendshipId, userId },
      {
        onError: (err: Error) => toastError(`friend-request-accept-${userId}`)(err)
      }
    );
  };

  const decline = (friendshipId: string) => {
    declineRequest.mutate(
      { friendshipId, userId },
      {
        onError: (err: Error) => toastError(`friend-request-decline-${userId}`)(err)
      }
    );
  };

  const call = () => {
    callFriend.mutate({ userId }, { onError: toastError(`friend-call-${userId}`) });
    appEvents.emit.profileCardClose();
  };

  return { isBusy, add, cancelRequest, accept, decline, call };
};

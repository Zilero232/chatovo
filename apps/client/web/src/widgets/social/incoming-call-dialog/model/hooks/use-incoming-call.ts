import { useNavigate } from '@tanstack/react-router';

import { useToastError } from '@/entities/app/locale';
import {
  useAcceptIncomingFriendCall,
  useDeclineIncomingFriendCall,
  useFriendCallRingtone,
  useIncomingFriendCall
} from '@/entities/social/friend';
import { ROUTES } from '@/shared/constants';
import { buildRoomSearch } from '@/shared/lib';

export const useIncomingCall = () => {
  const toastError = useToastError();
  const navigate = useNavigate();

  const { data } = useIncomingFriendCall();
  const acceptCall = useAcceptIncomingFriendCall();
  const declineCall = useDeclineIncomingFriendCall();

  const call = data?.call ?? null;
  const isBusy = acceptCall.isPending || declineCall.isPending;

  useFriendCallRingtone(call !== null, 'incoming');

  const decline = () => {
    declineCall.mutate(undefined, {
      onError: toastError('incoming-call-decline')
    });
  };

  const accept = () => {
    acceptCall.mutate(undefined, {
      onSuccess: (accepted) => {
        if (!accepted) {
          return;
        }

        navigate({
          to: ROUTES.room,
          search: buildRoomSearch(accepted.roomId, { title: accepted.caller.name })
        });
      },
      onError: toastError('incoming-call-accept')
    });
  };

  return { call, isBusy, accept, decline };
};

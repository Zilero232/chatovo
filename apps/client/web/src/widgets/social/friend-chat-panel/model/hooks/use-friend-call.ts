import { useNavigate } from '@tanstack/react-router';
import { match } from 'ts-pattern';

import { useToastError } from '@/entities/app/locale';
import { useRoomSession } from '@/entities/room/session';
import { useCallDuration, useDmCalls, useStartDmCall } from '@/entities/social/dm-call';
import { ROUTES } from '@/shared/constants';
import { buildRoomSearch } from '@/shared/lib';

export const useFriendCall = (peerId: string) => {
  const navigate = useNavigate();
  const toastError = useToastError();

  const { current } = useDmCalls();
  const { session } = useRoomSession();
  const startCall = useStartDmCall();

  const call = current?.peer.id === peerId && current.state !== 'ended' ? current : null;
  const duration = useCallDuration(call);

  const status = match({ call, isInCall: call !== null && session?.roomId === call.roomId })
    .with({ call: null }, () => 'idle' as const)
    .with({ call: { state: 'ringing' } }, () => 'calling' as const)
    .with({ isInCall: true }, () => 'inCall' as const)
    .otherwise(() => 'ongoing' as const);

  const start = () => {
    startCall.mutate(peerId, { onError: toastError(`friend-call-${peerId}`) });
  };

  const join = () => {
    if (call) {
      navigate({
        to: ROUTES.room,
        search: buildRoomSearch(call.roomId, { title: call.peer.name })
      });
    }
  };

  return { status, duration, isStarting: startCall.isPending, start, join };
};

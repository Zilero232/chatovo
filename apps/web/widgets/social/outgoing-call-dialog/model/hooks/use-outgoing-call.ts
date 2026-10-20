'use client';

import { friendCallStatusSchema } from '@chatovo/schemas';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useEffectEvent, useRef } from 'react';
import { toast } from 'sonner';

import { useToastError } from '@/entities/app/locale';
import {
  useCancelOutgoingFriendCall,
  useFriendCallRingtone,
  useOutgoingFriendCall
} from '@/entities/social/friend';
import { ackOutgoingFriendCall } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';
import { buildRoomHref } from '@/shared/lib';

const CALL_STATUS = friendCallStatusSchema.enum;

export const useOutgoingCall = () => {
  const t = useTranslations('friends.outgoingCall');
  const toastError = useToastError();
  const router = useRouter();
  const queryClient = useQueryClient();
  const handledRef = useRef<string | null>(null);

  const { data } = useOutgoingFriendCall();
  const cancelCall = useCancelOutgoingFriendCall();

  const call = data?.call ?? null;
  const isRinging = call?.status === CALL_STATUS.ringing;

  useFriendCallRingtone(isRinging, 'outgoing');

  const clearOutgoing = useEffectEvent(async () => {
    await ackOutgoingFriendCall();
    queryClient.setQueryData(QUERY_KEYS.friendCallOutgoing(), { call: null });
  });

  const notifyDeclined = useEffectEvent((name: string, roomId: string) => {
    toast.error(t('declined', { name }), { id: `outgoing-call-declined-${roomId}` });
  });

  useEffect(() => {
    if (!call || call.status === CALL_STATUS.ringing) {
      return;
    }

    const key = `${call.roomId}:${call.status}`;

    if (handledRef.current === key) {
      return;
    }

    handledRef.current = key;

    if (call.status === CALL_STATUS.accepted) {
      router.push(buildRoomHref(call.roomId, { title: call.callee.name }));
      clearOutgoing();
      return;
    }

    if (call.status === CALL_STATUS.declined) {
      notifyDeclined(call.callee.name, call.roomId);
      clearOutgoing();
    }
    // eslint-disable-next-line react/exhaustive-deps -- only a new call state should re-run this; router and the toast event are stable
  }, [call]);

  const cancel = () => {
    cancelCall.mutate(undefined, {
      onError: toastError('outgoing-call-cancel')
    });
  };

  return { call, isRinging, isBusy: cancelCall.isPending, cancel };
};

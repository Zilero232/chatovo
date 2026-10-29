import type { DmCallView } from '@chatovo/schemas';

import { useNavigate } from '@tanstack/react-router';
import { useEffect, useEffectEvent, useRef } from 'react';
import { toast } from 'sonner';
import { match } from 'ts-pattern';
import { useTranslations } from 'use-intl';

import { useToastError } from '@/entities/app/locale';
import { useRoomSession } from '@/entities/room/session';
import {
  useCallLoopSound,
  useCallTone,
  useDmCallCommand,
  useDmCalls
} from '@/entities/social/dm-call';
import { apiErrorCode } from '@/shared/api';
import { ROUTES } from '@/shared/constants';
import { buildRoomSearch } from '@/shared/lib';

import { STALE_CALL_CODES } from '../../config';
import { useCallAttention } from './use-call-attention';

export const useIncomingCall = () => {
  const t = useTranslations('friends.incomingCall');
  const navigate = useNavigate();
  const toastError = useToastError();

  const { incoming, current } = useDmCalls();
  const { session } = useRoomSession();
  const command = useDmCallCommand();
  const playTone = useCallTone();
  const { primeNotifications } = useCallAttention(incoming);

  const acceptedIdRef = useRef<string | null>(null);
  const lastIncomingRef = useRef<DmCallView | null>(null);

  const isOnCall = current?.state === 'active' && current.id !== incoming?.id;
  const isInOtherRoom = session !== null && session.roomId !== incoming?.roomId;

  const variant = match({ isOnCall, isInOtherRoom })
    .with({ isOnCall: true }, () => 'busy' as const)
    .with({ isInOtherRoom: true }, () => 'leavesRoom' as const)
    .otherwise(() => 'normal' as const);

  const hint = match(variant)
    .with('busy', () => t('busyHint'))
    .with('leavesRoom', () => t('roomHint', { room: session?.roomName ?? '' }))
    .with('normal', () => null)
    .exhaustive();

  useCallLoopSound(incoming !== null && variant !== 'busy', 'incoming');

  const onIncomingChange = useEffectEvent(() => {
    const last = lastIncomingRef.current;

    lastIncomingRef.current = incoming;

    if (incoming && variant === 'busy') {
      playTone('waiting');
    }

    const isAnsweredElsewhere =
      last !== null &&
      incoming?.id !== last.id &&
      current?.id === last.id &&
      current.state === 'active' &&
      acceptedIdRef.current !== last.id;

    if (isAnsweredElsewhere) {
      toast.info(t('answeredElsewhere'), { id: `dm-call-elsewhere-${last.id}` });
    }
  });

  const incomingId = incoming?.id ?? null;

  useEffect(() => {
    onIncomingChange();
  }, [incomingId]);

  const reportFailure = (error: unknown) => {
    if (STALE_CALL_CODES.has(apiErrorCode(error))) {
      toast.info(t('unavailable'), { id: 'dm-call-unavailable' });

      return;
    }

    toastError('dm-call-answer')(error);
  };

  const accept = async () => {
    if (!incoming) {
      return;
    }

    const call = incoming;

    primeNotifications();
    acceptedIdRef.current = call.id;

    try {
      await command.mutateAsync({ callId: call.id, command: 'accept' });

      navigate({
        to: ROUTES.room,
        search: buildRoomSearch(call.roomId, { title: call.peer.name })
      });
    } catch (error) {
      acceptedIdRef.current = null;
      reportFailure(error);
    }
  };

  const decline = () => {
    if (!incoming) {
      return;
    }

    primeNotifications();
    command.mutate({ callId: incoming.id, command: 'decline' }, { onError: reportFailure });
  };

  return {
    incoming,
    hint,
    isBusyVariant: variant === 'busy',
    isPending: command.isPending,
    accept,
    decline
  };
};

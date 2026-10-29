import type { Participant } from 'livekit-client';

import { match, P } from 'ts-pattern';
import { useTranslations } from 'use-intl';

import { useToastError } from '@/entities/app/locale';
import {
  formatCallDuration,
  useCallLoopSound,
  useCallOutcomeText,
  useDmCallForRoom,
  useSecondsLeft,
  useStartDmCall
} from '@/entities/social/dm-call';

import { useCurrentRoomId } from '../use-current-room-id';

export const useDmStage = (peerParticipant: Participant | undefined) => {
  const t = useTranslations('room.dmCall');
  const toastError = useToastError();

  const roomId = useCurrentRoomId();
  const call = useDmCallForRoom(roomId);
  const secondsLeft = useSecondsLeft(call?.peerGraceEndsAt ?? null);
  const outcomeText = useCallOutcomeText();
  const startCall = useStartDmCall();

  const isRinging = call?.state === 'ringing' && call.direction === 'outgoing';

  useCallLoopSound(isRinging, 'outgoing');

  const phase = match({ call, hasPeer: peerParticipant !== undefined })
    .with({ call: { state: 'ended' } }, () => 'ended' as const)
    .with({ hasPeer: true }, () => 'live' as const)
    .with({ call: { state: 'ringing', direction: 'outgoing' } }, () => 'ringing' as const)
    .with({ call: { state: 'active', peerGraceEndsAt: P.string } }, () => 'peerLeft' as const)
    .with({ call: P.nonNullable }, () => 'connecting' as const)
    .otherwise(() => 'waiting' as const);

  const name = call?.peer.name ?? '';

  const status = match(phase)
    .with('live', () => null)
    .with('waiting', () => t('waiting'))
    .with('connecting', () => t('connecting', { name }))
    .with('ringing', () =>
      match(call)
        .with({ peerBusy: true }, () => t('peerBusy', { name }))
        .with({ calleeReachable: true }, () => t('ringing', { name }))
        .otherwise(() => t('calling', { name }))
    )
    .with('peerLeft', () =>
      t('peerLeft', { name, countdown: formatCallDuration(secondsLeft ?? 0) })
    )
    .with('ended', () => (call ? outcomeText(call) : t('waiting')))
    .exhaustive();

  const ringAgain = () => {
    if (call) {
      startCall.mutate(call.peer.id, { onError: toastError(`dm-call-ring-${call.peer.id}`) });
    }
  };

  return {
    phase,
    status,
    peer: call?.peer ?? null,
    isPulsing: phase === 'ringing' || phase === 'connecting',
    canRingAgain: phase === 'peerLeft',
    isRingingAgain: startCall.isPending,
    ringAgain
  };
};

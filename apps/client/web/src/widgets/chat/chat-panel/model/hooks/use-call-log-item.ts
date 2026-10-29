import type { ChatCallLog } from '@chatovo/schemas';

import { useFormatter, useTranslations } from 'use-intl';

import { useToastError } from '@/entities/app/locale';
import { useCurrentUser } from '@/entities/auth/user';
import { formatCallDuration, resolveCallLogLabel, useStartDmCall } from '@/entities/social/dm-call';

type UseCallLogItemInput = {
  call: ChatCallLog;
  peerId: string | null;
  timestamp: number;
};

export const useCallLogItem = ({ call, peerId, timestamp }: UseCallLogItemInput) => {
  const t = useTranslations('chat.callLog');
  const format = useFormatter();
  const toastError = useToastError();

  const { user } = useCurrentUser();
  const startCall = useStartDmCall();

  const { key, isOutgoing, isMissed, durationSec } = resolveCallLogLabel({
    log: call,
    viewerId: user?.id ?? ''
  });

  const callBack = () => {
    if (peerId) {
      startCall.mutate(peerId, { onError: toastError(`dm-call-back-${peerId}`) });
    }
  };

  return {
    label: t(key),
    duration: durationSec === null ? null : formatCallDuration(durationSec),
    time: format.dateTime(timestamp, { hour: '2-digit', minute: '2-digit' }),
    isOutgoing,
    isMissed,
    canCallBack: peerId !== null,
    isCalling: startCall.isPending,
    callBack
  };
};

import type { DmCallView } from '@chatovo/schemas';

import { useTranslations } from 'use-intl';

import { formatCallDuration, resolveCallOutcome, secondsBetween } from '../../lib';

export const useCallOutcomeText = () => {
  const t = useTranslations('room.dmCall');

  return (call: DmCallView) => {
    const outcome = resolveCallOutcome(call);
    const seconds = secondsBetween({ from: call.answeredAt, to: call.endedAt ?? Date.now() });

    if (outcome === 'ended' && seconds !== null) {
      return t('endedWithDuration', { duration: formatCallDuration(seconds) });
    }

    return t(outcome, { name: call.peer.name });
  };
};

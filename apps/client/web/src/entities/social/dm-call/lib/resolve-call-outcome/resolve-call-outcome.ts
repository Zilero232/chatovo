import type { DmCallView } from '@chatovo/schemas';

import { match } from 'ts-pattern';

import type { CallOutcomeKey } from './resolve-call-outcome.types';

export const resolveCallOutcome = ({
  endReason,
  direction
}: Pick<DmCallView, 'direction' | 'endReason'>): CallOutcomeKey => {
  const isOutgoing = direction === 'outgoing';

  return match(endReason)
    .with('declined', () => (isOutgoing ? 'declined' : 'ended'))
    .with('missed', () => (isOutgoing ? 'noAnswer' : 'ended'))
    .with('busy', () => 'busy' as const)
    .with('cancelled', () => 'cancelled' as const)
    .with('failed', () => 'failed' as const)
    .with('completed', 'blocked', null, () => 'ended' as const)
    .exhaustive();
};

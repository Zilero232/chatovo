import { match } from 'ts-pattern';

import type {
  CallLogLabel,
  CallLogLabelKey,
  ResolveCallLogLabelInput
} from './resolve-call-log-label.types';

export const resolveCallLogLabel = ({ log, viewerId }: ResolveCallLogLabelInput): CallLogLabel => {
  const isCaller = log.callerId === viewerId;

  const key = match(log.outcome)
    .returnType<CallLogLabelKey>()
    .with('completed', () => (isCaller ? 'outgoing' : 'incoming'))
    .with('missed', () => (isCaller ? 'noAnswer' : 'missed'))
    .with('cancelled', () => (isCaller ? 'cancelled' : 'missed'))
    .with('declined', () => (isCaller ? 'declinedByPeer' : 'declinedBySelf'))
    .with('busy', () => (isCaller ? 'busy' : 'missed'))
    .with('failed', 'blocked', () => 'failed')
    .exhaustive();

  return {
    key,
    isOutgoing: isCaller,
    isMissed: key === 'missed',
    durationSec: log.outcome === 'completed' ? log.durationSec : null
  };
};

import type { ChatCallLog } from '@chatovo/schemas';

export type CallLogLabelKey =
  | 'busy'
  | 'cancelled'
  | 'declinedByPeer'
  | 'declinedBySelf'
  | 'failed'
  | 'incoming'
  | 'missed'
  | 'noAnswer'
  | 'outgoing';

export type CallLogLabel = {
  durationSec: number | null;
  isMissed: boolean;
  isOutgoing: boolean;
  key: CallLogLabelKey;
};

export type ResolveCallLogLabelInput = {
  log: ChatCallLog;
  viewerId: string;
};

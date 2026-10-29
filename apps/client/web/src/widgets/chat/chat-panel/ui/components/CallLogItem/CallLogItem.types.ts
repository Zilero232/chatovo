import type { ChatCallLog } from '@chatovo/schemas';

export type CallLogItemProps = {
  call: ChatCallLog;
  peerId: string | null;
  timestamp: number;
};

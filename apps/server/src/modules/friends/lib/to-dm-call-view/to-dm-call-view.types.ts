import type { DmCall } from '../../friends.types';

export type ToDmCallViewInput = {
  call: DmCall;
  peerBusy: boolean;
  viewerId: string;
};

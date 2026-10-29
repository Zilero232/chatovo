import type { DmCallEndReason, FriendUser } from '@chatovo/schemas';

import type { DmCall, DmCallEvent } from '../../friends.types';

export type ReduceDmCallInput = {
  call: DmCall;
  event: DmCallEvent;
  now: number;
};

export type CreateDmCallInput = {
  callee: FriendUser;
  calleeReachable: boolean;
  caller: FriendUser;
  id: string;
  now: number;
  roomId: string;
};

export type EndDmCallInput = {
  call: DmCall;
  now: number;
  reason: DmCallEndReason;
};

export type DmCallClockInput = {
  call: DmCall;
  now: number;
};

export type DmCallUserClockInput = DmCallClockInput & {
  userId: string;
};

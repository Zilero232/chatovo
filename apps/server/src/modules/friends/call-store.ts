import type { FriendCallStreamSnapshot } from '@chatovo/schemas';

import { friendCallStatusSchema } from '@chatovo/schemas';

import type { ClearCallsBetweenInput, PendingFriendCall } from './friends.types';

import { DomainEvent } from '../../common/events/domain-events';
import { emitDomainEvent } from '../../common/events/emit-domain-event';
import { emitFriendsSnapshot } from '../realtime';

const CALL_STATUS = friendCallStatusSchema.enum;

const CALL_TTL_MS = 60_000;
const ACCEPTED_ACK_TTL_MS = 10_000;

const byCallee = new Map<string, PendingFriendCall>();
const byCaller = new Map<string, PendingFriendCall>();
const friendsEpochByUser = new Map<string, number>();

const isExpired = (call: PendingFriendCall) => Date.now() > call.expiresAt;

const isActive = (call: PendingFriendCall | undefined): call is PendingFriendCall =>
  !!call && !isExpired(call);

const isActiveRinging = (call: PendingFriendCall | undefined): call is PendingFriendCall =>
  isActive(call) && call.status === CALL_STATUS.ringing;

const emitUser = (userId: string) => {
  // eslint-disable-next-line ts/no-use-before-define -- emitUser and getUserCallSnapshot are mutually recursive through pruneExpired; both only run after module init
  emitFriendsSnapshot(userId, getUserCallSnapshot(userId));
};

const emitUsers = (userIds: Iterable<string>) => {
  for (const userId of userIds) {
    emitUser(userId);
  }
};

const pruneExpired = () => {
  const affected = new Set<string>();

  for (const [calleeId, call] of byCallee) {
    if (isExpired(call)) {
      byCallee.delete(calleeId);
      byCaller.delete(call.caller.id);
      affected.add(calleeId);
      affected.add(call.caller.id);
    }
  }

  for (const [callerId, call] of byCaller) {
    if (isExpired(call)) {
      byCaller.delete(callerId);
      byCallee.delete(call.calleeId);
      affected.add(callerId);
      affected.add(call.calleeId);
    }
  }

  emitUsers(affected);
};

export const getUserCallSnapshot = (userId: string): FriendCallStreamSnapshot => {
  pruneExpired();

  const incomingCall = byCallee.get(userId);
  const outgoingCall = byCaller.get(userId);

  return {
    incoming: isActiveRinging(incomingCall)
      ? { roomId: incomingCall.roomId, caller: incomingCall.caller }
      : null,
    outgoing: isActive(outgoingCall)
      ? {
          roomId: outgoingCall.roomId,
          callee: outgoingCall.callee,
          status: outgoingCall.status
        }
      : null,
    friendsEpoch: friendsEpochByUser.get(userId) ?? 0
  };
};

export const bumpFriendsEpoch = (...userIds: string[]): void => {
  const unique = new Set(userIds);

  for (const userId of unique) {
    friendsEpochByUser.set(userId, (friendsEpochByUser.get(userId) ?? 0) + 1);
    emitUser(userId);
  }
};

export const setPendingCall = (
  input: Pick<PendingFriendCall, 'callee' | 'calleeId' | 'caller' | 'roomId'>
): void => {
  pruneExpired();

  const pending: PendingFriendCall = {
    ...input,
    status: CALL_STATUS.ringing,
    expiresAt: Date.now() + CALL_TTL_MS
  };

  byCallee.set(input.calleeId, pending);
  byCaller.set(input.caller.id, pending);

  emitUsers([input.calleeId, input.caller.id]);

  emitDomainEvent(DomainEvent.CallRinging, {
    calleeId: input.calleeId,
    caller: input.caller,
    roomId: input.roomId
  });
};

export const getPendingCallForCallee = (calleeId: string): PendingFriendCall | null => {
  pruneExpired();

  const call = byCallee.get(calleeId);

  if (!isActiveRinging(call)) {
    return null;
  }

  return call;
};

export const getPendingCallForCaller = (callerId: string): PendingFriendCall | null => {
  pruneExpired();

  const call = byCaller.get(callerId);

  if (!isActive(call)) {
    byCaller.delete(callerId);

    return null;
  }

  return call;
};

export const markCallAccepted = (calleeId: string): PendingFriendCall | null => {
  pruneExpired();

  const call = byCallee.get(calleeId);

  if (!isActiveRinging(call)) {
    return null;
  }

  call.status = CALL_STATUS.accepted;
  call.expiresAt = Date.now() + ACCEPTED_ACK_TTL_MS;
  byCallee.delete(calleeId);

  emitUsers([calleeId, call.caller.id]);

  return call;
};

export const markCallDeclined = (calleeId: string): void => {
  pruneExpired();

  const call = byCallee.get(calleeId);

  if (!isActive(call)) {
    byCallee.delete(calleeId);

    return;
  }

  call.status = CALL_STATUS.declined;
  byCallee.delete(calleeId);

  emitUsers([calleeId, call.caller.id]);
};

export const clearFriendsEpoch = (userId: string): void => {
  if (byCallee.has(userId) || byCaller.has(userId)) {
    return;
  }

  friendsEpochByUser.delete(userId);
};

export const clearPendingCallForCaller = (callerId: string): void => {
  const call = byCaller.get(callerId);

  if (!call) {
    return;
  }

  byCallee.delete(call.calleeId);
  byCaller.delete(callerId);

  emitUsers([callerId, call.calleeId]);
};

export const clearCallsBetween = ({ userId, otherUserId }: ClearCallsBetweenInput): void => {
  if (byCaller.get(userId)?.calleeId === otherUserId) {
    clearPendingCallForCaller(userId);
  }

  if (byCaller.get(otherUserId)?.calleeId === userId) {
    clearPendingCallForCaller(otherUserId);
  }
};

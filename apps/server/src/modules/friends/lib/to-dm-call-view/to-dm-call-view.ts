import type { DmCallView } from '@chatovo/schemas';

import type { ToDmCallViewInput } from './to-dm-call-view.types';

const toIso = (value: number | null) => (value === null ? null : new Date(value).toISOString());

/** The call as one of its two participants sees it: their direction, the peer, who is in the room. */
export const toDmCallView = ({ call, viewerId, peerBusy }: ToDmCallViewInput): DmCallView => {
  const isCaller = call.caller.id === viewerId;
  const peer = isCaller ? call.callee : call.caller;
  const peerInCall = call.inCall.includes(peer.id);

  return {
    id: call.id,
    roomId: call.roomId,
    direction: isCaller ? 'outgoing' : 'incoming',
    peer,
    state: call.state,
    startedAt: new Date(call.startedAt).toISOString(),
    ringEndsAt: toIso(call.ringEndsAt),
    answeredAt: toIso(call.answeredAt),
    endedAt: toIso(call.endedAt),
    endReason: call.endReason,
    calleeReachable: call.calleeReachable,
    peerBusy,
    peerInCall,
    selfInCall: call.inCall.includes(viewerId),
    peerGraceEndsAt: call.state === 'active' && !peerInCall ? toIso(call.graceEndsAt) : null
  };
};

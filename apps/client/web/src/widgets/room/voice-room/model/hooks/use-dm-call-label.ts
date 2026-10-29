import { useCallDuration, useDmCallForRoom } from '@/entities/social/dm-call';

import { useCurrentRoomId } from './use-current-room-id';

export const useDmCallLabel = (roomName: string) => {
  const roomId = useCurrentRoomId();
  const call = useDmCallForRoom(roomId);
  const duration = useCallDuration(call);

  return {
    title: call?.peer.name ?? roomName,
    duration,
    isRinging: call?.state === 'ringing'
  };
};

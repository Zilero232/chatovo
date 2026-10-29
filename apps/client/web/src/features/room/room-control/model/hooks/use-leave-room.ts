import { useRoomContext } from '@livekit/components-react';

import { useDmCallCommand, useDmCallForRoom } from '@/entities/social/dm-call';

export const useLeaveRoom = () => {
  const room = useRoomContext();

  const call = useDmCallForRoom(room.name);
  const command = useDmCallCommand();

  return () => {
    if (call && call.state !== 'ended') {
      const isUnanswered = call.state === 'ringing' && call.direction === 'outgoing';

      command.mutate({ callId: call.id, command: isUnanswered ? 'cancel' : 'hangup' });
    }

    void room.disconnect();
  };
};

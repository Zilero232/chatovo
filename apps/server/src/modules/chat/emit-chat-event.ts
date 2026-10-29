import type { ChatRealtimeEvent, ChatRealtimeEventInput } from './chat.types';

import { RoomKind } from '../../../generated';
import { DomainEvent } from '../../common/events/domain-events';
import { emitDomainEvent } from '../../common/events/emit-domain-event';
import { getRoomDmRouting } from '../../lib';
import { emitRoomEvent, emitUserEvent } from '../realtime';

export const emitChatEvent = async (
  roomId: string,
  event: ChatRealtimeEventInput
): Promise<void> => {
  const room = await getRoomDmRouting(roomId);

  const roomKind = room?.kind ?? RoomKind.group;
  const message: ChatRealtimeEvent = { ...event, roomId, roomKind };

  if (room?.kind === RoomKind.dm && room.dmUserAId && room.dmUserBId) {
    emitUserEvent(room.dmUserAId, message);
    emitUserEvent(room.dmUserBId, message);

    if (event.type === 'chat.message' && event.message.senderId && event.message.kind === 'text') {
      const recipientId =
        event.message.senderId === room.dmUserAId ? room.dmUserBId : room.dmUserAId;

      emitDomainEvent(DomainEvent.DmMessageSent, { recipientId, message: event.message });
    }

    return;
  }

  emitRoomEvent(roomId, message);
};

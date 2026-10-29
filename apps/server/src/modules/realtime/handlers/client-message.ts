import { realtimeClientMessageSchema, safeJsonParse } from '@chatovo/schemas';
import { match } from 'ts-pattern';

import type { RealtimeConnection } from '../realtime.types';

import { filterAccessibleRooms } from '../../../lib';
import { isInvisibleInRoom } from '../../livekit';
import { patchParticipant } from '../../livekit/presence';
import { setConnectionRooms } from '../connection-store';
import { emitRoomEvent } from '../emit';

export const handleClientMessage = async (
  connection: RealtimeConnection,
  raw: string | ArrayBuffer | Blob | Buffer | SharedArrayBuffer
): Promise<void> => {
  const text =
    typeof raw === 'string'
      ? raw
      : raw instanceof Blob
        ? await raw.text()
        : new TextDecoder().decode(raw instanceof SharedArrayBuffer ? new Uint8Array(raw) : raw);
  const parsed = realtimeClientMessageSchema.safeParse(safeJsonParse(text));

  if (!parsed.success) {
    return;
  }

  await match(parsed.data)
    .with({ op: 'subscribe' }, async ({ rooms }) => {
      const accessible = await filterAccessibleRooms({ roomIds: rooms, userId: connection.userId });

      setConnectionRooms(connection.id, accessible);
    })
    .with({ op: 'presence.patch' }, ({ roomId, micMuted, deafened, activity }) => {
      if (!connection.rooms.has(roomId)) {
        return;
      }

      patchParticipant(roomId, connection.userId, { micMuted, deafened, activity });
    })
    .with({ op: 'room.reaction' }, ({ roomId, emoji }) => {
      if (!connection.rooms.has(roomId)) {
        return;
      }

      if (isInvisibleInRoom({ roomId, identity: connection.userId })) {
        return;
      }

      emitRoomEvent(roomId, {
        type: 'room.reaction',
        roomId,
        emoji,
        senderId: connection.userId
      });
    })
    .with({ op: 'client.activity' }, ({ active }) => {
      connection.isActive = active;
    })
    .exhaustive();
};

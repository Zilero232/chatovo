import type { RoomParticipant, RoomsParticipantsSnapshot } from '@chatovo/schemas';
import type { WebSocket } from 'ws';

export type RealtimeConnection = {
  id: string;
  isActive: boolean;
  canSeeInvisible: boolean;
  isAlive: boolean;
  rooms: Set<string>;
  userId: string;
  ws: WebSocket;
};

export type UnsubscribeUserFromRoomInput = {
  roomId: string;
  userId: string;
};

export type DmRoomPresence = {
  memberIds: string[];
  participants: RoomParticipant[];
  roomId: string;
};

export type PresenceSnapshots = {
  admin: RoomsParticipantsSnapshot;
  dmRooms: DmRoomPresence[];
  public: RoomsParticipantsSnapshot;
};

import type { Room, RoomsParticipantsSnapshot } from '@chatovo/schemas';

export type RoomsPresenceMap = RoomsParticipantsSnapshot['rooms'];

export type RoomSection = {
  key: 'private' | 'public';
  rooms: Room[];
};

export type RoomsFilter = 'all' | 'live' | 'mine';

export type RoomsFilterCounts = Record<RoomsFilter, number>;

export type CountRoomsByFilterInput = {
  presence: RoomsPresenceMap;
  rooms: Room[];
  currentUserId?: string;
};

export type GroupRoomsInput = {
  presence: RoomsPresenceMap;
  query: string;
  rooms: Room[];
  currentUserId?: string;
  filter?: RoomsFilter;
};

import type { Room } from '@chatovo/schemas';

import { isEmpty, partition, sortBy } from 'remeda';
import { match } from 'ts-pattern';

import type {
  CountRoomsByFilterInput,
  GroupRoomsInput,
  RoomSection,
  RoomsFilter,
  RoomsFilterCounts,
  RoomsPresenceMap
} from './group-rooms.types';

type MatchesFilterInput = {
  filter: RoomsFilter;
  presence: RoomsPresenceMap;
  room: Room;
  currentUserId?: string;
};

type FilterAndOrderInput = {
  presence: RoomsPresenceMap;
  query: string;
  rooms: Room[];
};

const participantCount = (presence: RoomsPresenceMap, roomId: string) =>
  presence[roomId]?.length ?? 0;

const matchesFilter = ({ room, presence, filter, currentUserId }: MatchesFilterInput) =>
  match(filter)
    .with('all', () => true)
    .with('live', () => participantCount(presence, room.id) > 0)
    .with('mine', () => room.ownerId === currentUserId)
    .exhaustive();

const filterAndOrderRooms = ({ rooms, presence, query }: FilterAndOrderInput): Room[] => {
  const normalized = query.trim().toLowerCase();

  const matched = normalized
    ? rooms.filter((room) => room.name.toLowerCase().includes(normalized))
    : rooms;

  return sortBy(
    matched,
    [(room) => participantCount(presence, room.id), 'desc'],
    [(room) => room.name.toLowerCase(), 'asc']
  );
};

export const countRoomsByFilter = ({
  rooms,
  presence,
  currentUserId
}: CountRoomsByFilterInput): RoomsFilterCounts => ({
  all: rooms.length,
  live: rooms.filter((room) => matchesFilter({ room, presence, filter: 'live' })).length,
  mine: rooms.filter((room) => matchesFilter({ room, presence, filter: 'mine', currentUserId }))
    .length
});

export const groupRooms = ({
  rooms,
  presence,
  query,
  filter = 'all',
  currentUserId
}: GroupRoomsInput): RoomSection[] => {
  const scoped = rooms.filter((room) => matchesFilter({ room, presence, filter, currentUserId }));
  const ordered = filterAndOrderRooms({ rooms: scoped, presence, query });
  const [privateRooms, publicRooms] = partition(ordered, (room) => room.isPrivate);

  return (
    [
      { key: 'private', rooms: privateRooms },
      { key: 'public', rooms: publicRooms }
    ] satisfies RoomSection[]
  ).filter((section) => !isEmpty(section.rooms));
};

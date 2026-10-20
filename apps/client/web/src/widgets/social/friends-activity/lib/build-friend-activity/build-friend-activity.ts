import { entries, indexBy, isNullish, sortBy } from 'remeda';

import type { BuildFriendActivityInput, FriendActivity } from './build-friend-activity.types';

export const buildFriendActivity = ({
  friends,
  presence,
  rooms
}: BuildFriendActivityInput): FriendActivity => {
  const friendsById = indexBy(friends, (entry) => entry.user.id);
  const roomsById = indexBy(rooms, (room) => room.id);
  const busyIds = new Set<string>();

  const groups = entries(presence).flatMap(([roomId, participants]) => {
    const room = roomsById[roomId];

    if (isNullish(room)) {
      return [];
    }

    const matched = participants.flatMap((participant) => {
      const entry = friendsById[participant.identity];

      if (isNullish(entry)) {
        return [];
      }

      busyIds.add(entry.user.id);

      return [
        { friendshipId: entry.friendshipId, isLive: !participant.micMuted, user: entry.user }
      ];
    });

    if (matched.length === 0) {
      return [];
    }

    return [
      {
        friends: sortBy(
          matched,
          (friend) => (friend.isLive ? 0 : 1),
          (friend) => friend.user.name.toLowerCase()
        ),
        roomId: room.id,
        roomName: room.name,
        totalInRoom: participants.length
      }
    ];
  });

  const online = friends.filter((entry) => entry.user.isOnline && !busyIds.has(entry.user.id));

  return {
    inRooms: sortBy(
      groups,
      (group) => -group.friends.length,
      (group) => group.roomName.toLowerCase()
    ),
    online: sortBy(online, (entry) => entry.user.name.toLowerCase())
  };
};

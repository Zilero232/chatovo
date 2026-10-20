import type { FriendEntry, Room, RoomsParticipantsSnapshot } from '@chatovo/schemas';

export type ActivityFriend = {
  friendshipId: string;
  isLive: boolean;
  user: FriendEntry['user'];
};

export type ActivityRoomGroup = {
  friends: ActivityFriend[];
  roomId: string;
  roomName: string;
  totalInRoom: number;
};

export type FriendActivity = {
  inRooms: ActivityRoomGroup[];
  online: FriendEntry[];
};

export type BuildFriendActivityInput = {
  friends: FriendEntry[];
  presence: RoomsParticipantsSnapshot['rooms'];
  rooms: Room[];
};

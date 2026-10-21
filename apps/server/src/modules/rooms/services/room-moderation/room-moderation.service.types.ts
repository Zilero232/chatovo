import type { RoomModerationAction } from '@chatovo/schemas';

export type ListRoomBansInput = {
  roomId: string;
  userId: string;
};

export type UnbanRoomUserInput = {
  roomId: string;
  userId: string;
  targetId: string;
};

export type ModerateParticipantInput = {
  roomId: string;
  userId: string;
  targetId: string;
};

export type AssertIsRoomParticipantInput = {
  roomId: string;
  targetId: string;
};

export type NotifyModerationInput = {
  action: RoomModerationAction;
  room: { id: string; name: string };
  targetId: string;
};

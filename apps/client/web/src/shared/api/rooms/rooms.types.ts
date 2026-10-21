export type RoomParticipantAction = 'ban' | 'mute' | 'remove' | 'unmute';

export type ModerateRoomParticipantInput = {
  action: RoomParticipantAction;
  roomId: string;
  userId: string;
};

export type UnbanRoomUserInput = {
  roomId: string;
  userId: string;
};

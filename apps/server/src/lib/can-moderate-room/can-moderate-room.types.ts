export type CanModerateRoomInput = {
  isAdmin: boolean;
  room: { kind: string; ownerId: string };
  userId: string;
};

export type CanModerateRoomInput = {
  role: string | null | undefined;
  room: { kind: string; ownerId: string };
  userId: string;
};

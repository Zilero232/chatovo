import type { Room } from '@chatovo/schemas';

export type RoomItemTriggerProps = {
  isActive: boolean;
  isOwner: boolean;
  room: Room;
};

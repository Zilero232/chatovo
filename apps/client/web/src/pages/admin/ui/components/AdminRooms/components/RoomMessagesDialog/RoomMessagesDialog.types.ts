import type { AdminRoom } from '@chatovo/schemas';

export type RoomMessagesDialogProps = {
  room: AdminRoom;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

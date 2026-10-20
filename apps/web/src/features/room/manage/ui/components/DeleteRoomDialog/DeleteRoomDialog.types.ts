import type { Room } from '@chatovo/schemas';

export type DeleteRoomDialogProps = {
  open: boolean;
  room: Room;
  onOpenChange: (open: boolean) => void;
};

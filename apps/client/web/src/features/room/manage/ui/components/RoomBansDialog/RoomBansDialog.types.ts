import type { Room } from '@chatovo/schemas';

export type RoomBansDialogProps = {
  open: boolean;
  room: Room;
  onOpenChange: (open: boolean) => void;
};

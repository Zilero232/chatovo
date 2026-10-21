import type { Room } from '@chatovo/schemas';

export type RoomBansDialogProps = {
  open: boolean;
  room: Pick<Room, 'id' | 'name'>;
  onOpenChange: (open: boolean) => void;
};

import type { Room } from '@chatovo/schemas';

export type EditRoomDialogProps = {
  open: boolean;
  room: Room;
  onOpenChange: (open: boolean) => void;
};

export type EditRoomFormProps = {
  room: Room;
  onUpdated?: () => void;
};

import type { RoomBan } from '@chatovo/schemas';

export type RoomBanItemProps = {
  ban: RoomBan;
  isBusy: boolean;
  onUnban: () => void;
};

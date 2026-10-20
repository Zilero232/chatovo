export type MiniRoomBarVariant = 'docked' | 'floating';

export type MiniRoomBarProps = {
  isDm: boolean;
  roomName: string;
  variant?: MiniRoomBarVariant;
  onExpand: () => void;
};

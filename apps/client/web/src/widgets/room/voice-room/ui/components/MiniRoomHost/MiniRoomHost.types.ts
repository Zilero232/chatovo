import type { MiniRoomBarProps } from '../MiniRoomBar/MiniRoomBar.types';

export type MiniRoomHostProps = MiniRoomBarProps & {
  slot: HTMLElement | null;
};

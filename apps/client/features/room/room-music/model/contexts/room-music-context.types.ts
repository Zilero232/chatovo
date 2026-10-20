import type { ReactNode } from 'react';

export type RoomMusicStateInput = {
  roomId: string;
  isDeafened: boolean;
};

export type RoomMusicProviderProps = RoomMusicStateInput & {
  children: ReactNode;
};

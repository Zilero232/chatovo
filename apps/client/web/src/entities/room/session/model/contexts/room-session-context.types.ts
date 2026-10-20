export type RoomSession = {
  isChatOpen: boolean;
  isDm: boolean;
  isPrivate: boolean;
  password?: string;
  isInvisible: boolean;
  roomId: string;
  roomName: string;
  token: string;
};

export type RoomSessionValue = {
  close: (roomId?: string) => void;
  isRecentlyLeft: (roomId: string) => boolean;
  open: (session: RoomSession) => void;
  rejoin: () => void;
  session: RoomSession | null;
};

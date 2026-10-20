export type ExpandedRoomViewProps = {
  isChatOpen: boolean;
  isDm: boolean;
  roomId: string;
  roomName: string;
  onToggleChat: (next?: boolean) => void;
};

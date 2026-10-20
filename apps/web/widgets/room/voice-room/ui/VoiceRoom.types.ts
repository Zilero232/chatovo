import type { DisconnectReason } from 'livekit-client';

export type VoiceRoomProps = {
  initialChatOpen?: boolean;
  isDm?: boolean;
  isMinimized?: boolean;
  roomId: string;
  roomName: string;
  serverUrl: string;
  token: string;
  onConnectFailure: (reason: DisconnectReason) => void;
  onExpand: () => void;
  onLeave: () => void;
};

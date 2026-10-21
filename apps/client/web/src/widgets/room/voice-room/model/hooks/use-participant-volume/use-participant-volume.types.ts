export type ParticipantVolume = {
  isBlocked: boolean;
  isControllable: boolean;
  isMuted: boolean;
  volume: number;
  setVolume: (next: number) => void;
  toggleMute: () => void;
};

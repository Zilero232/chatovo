export type ParticipantVolume = {
  isControllable: boolean;
  isMuted: boolean;
  volume: number;
  setVolume: (next: number) => void;
  toggleMute: () => void;
};

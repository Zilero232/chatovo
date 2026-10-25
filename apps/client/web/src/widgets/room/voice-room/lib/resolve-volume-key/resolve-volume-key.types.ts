export type ResolveVolumeKeyInput = {
  canMute: boolean;
  key: string;
  volume: number;
};

export type VolumeKeyAction = { type: 'toggleMute' } | { type: 'volume'; volume: number };

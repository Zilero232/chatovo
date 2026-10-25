export type MusicVolumeMap = Record<string, number>;

export type ReadParticipantMusicVolumeInput = {
  identity: string;
  isBlocked: boolean;
  volumes: MusicVolumeMap;
};

export type WriteParticipantMusicVolumeInput = {
  identity: string;
  volume: number;
  volumes: MusicVolumeMap;
};

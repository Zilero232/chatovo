import type VimeoPlayer from '@vimeo/player';

export type MusicPlayerAdapter = {
  play: () => void;
  pause: () => void;
  seekTo: (positionMs: number) => void;
  setVolume: (volume: number) => void;
  readPositionMs: () => Promise<number>;
  readDurationMs: () => Promise<number | null>;
};

export type AudioElementAdapterInput = {
  audio: HTMLAudioElement;
  onBlocked: () => void;
};

export type MediaElementAdapterInput = {
  media: HTMLMediaElement;
  onBlocked: () => void;
};

export type VimeoAdapterInput = {
  player: VimeoPlayer;
  onBlocked: () => void;
};

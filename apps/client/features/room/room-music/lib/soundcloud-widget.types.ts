export type SoundcloudWidget = {
  bind: (event: string, listener: () => void) => void;
  unbind: (event: string) => void;
  play: () => void;
  pause: () => void;
  seekTo: (positionMs: number) => void;
  setVolume: (volume: number) => void;
  getPosition: (callback: (positionMs: number) => void) => void;
  getDuration: (callback: (durationMs: number) => void) => void;
};

export type SoundcloudWindow = Window & {
  SC?: {
    Widget: ((iframe: HTMLIFrameElement) => SoundcloudWidget) & {
      Events: Record<'ERROR' | 'FINISH' | 'READY', string>;
    };
  };
};

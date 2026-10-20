export type FileMusicSource = {
  track: MediaStreamTrack;
  element: HTMLAudioElement;
  load: (file: File) => Promise<void>;
  setMonitorVolume: (volume: number) => void;
  dispose: () => Promise<void>;
};

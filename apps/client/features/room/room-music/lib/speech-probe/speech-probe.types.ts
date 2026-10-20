import type { RemoteAudioTrack } from 'livekit-client';

export type SpeechProbe = {
  analyser: AnalyserNode;
  bins: Uint8Array<ArrayBuffer>;
  dispose: () => void;
};

export type CreateSpeechProbeInput = {
  context: AudioContext;
  track: RemoteAudioTrack;
};

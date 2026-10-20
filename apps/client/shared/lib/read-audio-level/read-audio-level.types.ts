export type ReadAudioLevelInput = {
  analyser: AnalyserNode;
  bins: Uint8Array<ArrayBuffer>;
};

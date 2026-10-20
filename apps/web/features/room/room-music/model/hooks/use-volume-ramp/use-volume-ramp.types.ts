export type UseVolumeRampInput = {
  target: number;
  resetKey: unknown;
  apply: (volume: number) => void;
  subscribeReapply?: (reapply: () => void) => () => void;
};

export type WebglTier = 'full' | 'lite' | 'off';

export type WebglEnvironment = {
  isReducedMotion: boolean;
  isSaveData: boolean;
  effectiveType?: string;
  deviceMemory?: number;
  cores?: number;
  isCoarse: boolean;
  isNarrow: boolean;
  hasWebgl: boolean;
};

export type UseWebglStageInput = {
  waitFor: 'idle' | 'near';
};

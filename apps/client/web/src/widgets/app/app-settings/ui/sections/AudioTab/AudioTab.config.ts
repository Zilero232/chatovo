import type { AudioSettings } from '@/entities/app/settings';

export const AUDIO_FLAGS = [
  'noiseSuppression',
  'echoCancellation',
  'autoGainControl',
  'voiceIsolation'
] satisfies (keyof AudioSettings)[];

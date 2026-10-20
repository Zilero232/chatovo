import { clamp } from 'remeda';

import type { ReadAudioLevelInput } from './read-audio-level.types';

/** Analyser settings `readAudioLevel` is tuned for: a tiny FFT, lightly smoothed. */
export const AUDIO_LEVEL_ANALYSER = { fftSize: 32, smoothingTimeConstant: 0.4 } as const;

const NOISE_FLOOR = 0.06;
const LEVEL_GAIN = 2.6;

/** Reads one frame off the analyser and returns the speech level as 0..1, noise floor removed. */
export const readAudioLevel = ({ analyser, bins }: ReadAudioLevelInput): number => {
  analyser.getByteFrequencyData(bins);

  let sum = 0;

  for (const bin of bins) {
    sum += bin * bin;
  }

  const rms = Math.sqrt(sum / bins.length) / 255;

  return clamp((rms - NOISE_FLOOR) * LEVEL_GAIN, { min: 0, max: 1 });
};

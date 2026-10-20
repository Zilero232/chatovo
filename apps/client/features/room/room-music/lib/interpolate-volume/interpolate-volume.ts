import { clamp } from 'remeda';

import type { InterpolateVolumeInput } from './interpolate-volume.types';

export const interpolateVolume = ({
  from,
  to,
  elapsedMs,
  durationMs
}: InterpolateVolumeInput): number => {
  const progress = durationMs > 0 ? clamp(elapsedMs / durationMs, { min: 0, max: 1 }) : 1;

  return from + (to - from) * progress;
};

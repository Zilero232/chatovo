import type { WebglEnvironment, WebglTier } from '../webgl.types';

import { SLOW_CONNECTIONS, WEBGL_LIMITS } from '../webgl.config';

/** How much 3D a device can afford: none, a light scene, or the full one. Pure, so it is tested. */
export const webglTier = ({
  isReducedMotion,
  isSaveData,
  effectiveType,
  deviceMemory,
  cores,
  isCoarse,
  isNarrow,
  hasWebgl
}: WebglEnvironment): WebglTier => {
  const memory = deviceMemory ?? WEBGL_LIMITS.unknownHigh;
  const threads = cores ?? WEBGL_LIMITS.unknownHigh;
  const isSlow = SLOW_CONNECTIONS.includes(effectiveType ?? '');

  if (
    isReducedMotion ||
    isSaveData ||
    isSlow ||
    !hasWebgl ||
    memory <= WEBGL_LIMITS.offMemory ||
    threads <= WEBGL_LIMITS.offCores
  ) {
    return 'off';
  }

  if (
    memory <= WEBGL_LIMITS.liteMemory ||
    threads <= WEBGL_LIMITS.liteCores ||
    (isCoarse && isNarrow)
  ) {
    return 'lite';
  }

  return 'full';
};

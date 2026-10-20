import type { WebglEnvironment } from '../webgl.types';

import { WEBGL_LIMITS } from '../webgl.config';

type NavigatorHints = Navigator & {
  connection?: { saveData?: boolean; effectiveType?: string };
  deviceMemory?: number;
};

const supportsWebgl2 = (): boolean => {
  try {
    const context = document.createElement('canvas').getContext('webgl2');

    context?.getExtension('WEBGL_lose_context')?.loseContext();

    return context !== null;
  } catch {
    return false;
  }
};

/** Reads what the browser says about the device; call only in the browser. */
export const readWebglEnvironment = (): WebglEnvironment => {
  const hints: NavigatorHints = navigator;

  return {
    isReducedMotion: window.matchMedia(WEBGL_LIMITS.reducedMotionQuery).matches,
    isSaveData: hints.connection?.saveData === true,
    effectiveType: hints.connection?.effectiveType,
    deviceMemory: hints.deviceMemory,
    cores: navigator.hardwareConcurrency,
    isCoarse: window.matchMedia(WEBGL_LIMITS.coarseQuery).matches,
    isNarrow: window.matchMedia(WEBGL_LIMITS.narrowQuery).matches,
    hasWebgl: supportsWebgl2()
  };
};

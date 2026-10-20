import { useEffect, useEffectEvent, useRef } from 'react';

import type { UseVolumeRampInput } from './use-volume-ramp.types';

import { VOLUME_RAMP } from '../../../config/music';
import { interpolateVolume } from '../../../lib';

export const useVolumeRamp = ({
  target,
  resetKey,
  apply,
  subscribeReapply
}: UseVolumeRampInput) => {
  const volumeRef = useRef(target);

  const applyVolume = useEffectEvent((volume: number) => {
    volumeRef.current = volume;
    apply(volume);
  });

  const subscribe = useEffectEvent(() => subscribeReapply?.(() => applyVolume(volumeRef.current)));

  useEffect(() => {
    applyVolume(volumeRef.current);

    return subscribe();
  }, [resetKey]);

  useEffect(() => {
    const from = volumeRef.current;
    const startedAt = performance.now();

    const intervalId = setInterval(() => {
      const elapsedMs = performance.now() - startedAt;

      applyVolume(
        interpolateVolume({ from, to: target, elapsedMs, durationMs: VOLUME_RAMP.durationMs })
      );

      if (elapsedMs >= VOLUME_RAMP.durationMs) {
        clearInterval(intervalId);
      }
    }, VOLUME_RAMP.stepMs);

    return () => clearInterval(intervalId);
  }, [target]);
};

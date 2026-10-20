'use client';

import { useEffect, useRef, useState } from 'react';

import type { UseWebglStageInput, WebglTier } from '../lib/webgl';

import {
  readWebglEnvironment,
  scheduleOnFirstInteraction,
  scheduleOnIdle,
  WEBGL_STAGE,
  webglTier
} from '../lib/webgl';

const readTier = (): WebglTier =>
  typeof window === 'undefined' ? 'off' : webglTier(readWebglEnvironment());

/** When a WebGL scene may mount (by device tier, on idle, near the viewport) and when it may render. */
export const useWebglStage = ({ waitFor }: UseWebglStageInput) => {
  const [tier] = useState(readTier);

  const [isArmed, setIsArmed] = useState(false);
  const [isNear, setIsNear] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tier === 'off') {
      return;
    }

    if (waitFor === 'near') {
      return scheduleOnIdle(() => setIsArmed(true));
    }

    return tier === 'lite'
      ? scheduleOnFirstInteraction(() => setIsArmed(true))
      : scheduleOnIdle(() => setIsArmed(true));
  }, [tier, waitFor]);

  useEffect(() => {
    const node = ref.current;

    if (!node || tier === 'off') {
      return;
    }

    const near = new IntersectionObserver(([entry]) => entry?.isIntersecting && setIsNear(true), {
      rootMargin: WEBGL_STAGE.nearMargin
    });
    const visible = new IntersectionObserver(([entry]) =>
      setIsVisible(Boolean(entry?.isIntersecting))
    );
    const onVisibility = () => setIsPageVisible(document.visibilityState === 'visible');

    near.observe(node);
    visible.observe(node);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      near.disconnect();
      visible.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [tier]);

  return {
    ref,
    tier,
    isActive: tier !== 'off' && isArmed && isNear,
    isRunning: isVisible && isPageVisible
  };
};

import { WEBGL_STAGE } from '../webgl.config';

export const scheduleOnIdle = (callback: () => void): (() => void) => {
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(callback, { timeout: WEBGL_STAGE.idleTimeoutMs });

    return () => window.cancelIdleCallback(id);
  }

  const id = setTimeout(callback, WEBGL_STAGE.idleTimeoutMs);

  return () => clearTimeout(id);
};

export const scheduleOnFirstInteraction = (callback: () => void): (() => void) => {
  const controller = new AbortController();

  const fire = () => {
    controller.abort();
    callback();
  };

  WEBGL_STAGE.interactionEvents.forEach((name) =>
    window.addEventListener(name, fire, { passive: true, signal: controller.signal })
  );

  return () => controller.abort();
};

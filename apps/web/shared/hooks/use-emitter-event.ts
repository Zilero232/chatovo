'use client';

import { useEffect, useEffectEvent } from 'react';

type EventListener = (...args: never[]) => unknown;

/**
 * Structural shape of a Node-style emitter.
 *
 * `any` is load-bearing here: LiveKit declares `on`/`off` as generics over each
 * emitter's own event enum (`<E extends keyof RoomEventCallbacks>`). Because
 * parameters are contravariant, any concrete type — `string`, `never`, a union —
 * makes `Room` and `Participant` fail to satisfy this shape.
 */
type Emitter = {
  off: (event: any, listener: any) => unknown;

  on: (event: any, listener: any) => unknown;
};

export const useEmitterEvent = <L extends EventListener>(
  emitter: Emitter,
  event: string,
  handler: L
) => {
  const onEvent = useEffectEvent(handler);

  useEffect(() => {
    const listener = (...args: Parameters<L>) => {
      onEvent(...args);
    };

    emitter.on(event, listener);

    return () => {
      emitter.off(event, listener);
    };
  }, [emitter, event]);
};

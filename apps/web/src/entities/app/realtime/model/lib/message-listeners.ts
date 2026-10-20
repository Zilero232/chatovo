import type { RealtimeServerMessage } from '@chatovo/schemas';

type Listener = (message: RealtimeServerMessage) => void;

const listeners = new Set<Listener>();

export const subscribeRealtimeMessage = (listener: Listener): (() => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

export const publishRealtimeMessage = (message: RealtimeServerMessage): void => {
  for (const listener of listeners) {
    listener(message);
  }
};

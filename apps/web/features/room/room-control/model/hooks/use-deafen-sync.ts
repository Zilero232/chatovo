'use client';

import { appEvents } from '@/shared/lib';

import { useDeafen } from './use-deafen';

export const useDeafenSync = () => {
  const { isDeafened, toggle, undeafen } = useDeafen();

  appEvents.on.deafenToggle(() => {
    toggle();
  });

  appEvents.on.micActivated(() => {
    if (isDeafened) {
      undeafen();
    }
  });
};

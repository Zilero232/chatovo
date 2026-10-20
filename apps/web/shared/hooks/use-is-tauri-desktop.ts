'use client';

import { useMount } from '@siberiacancode/reactuse';
import { useState } from 'react';

import { isTauriDesktop } from '@/shared/lib';

/**
 * Tauri desktop detection that survives the static-export prerender: stays
 * `false` until mount, so a desktop-only surface appears right after hydration
 * instead of being dropped by the prerender and never coming back.
 */
export const useIsTauriDesktop = (): boolean => {
  const [isDesktop, setIsDesktop] = useState(false);

  useMount(() => setIsDesktop(isTauriDesktop()));

  return isDesktop;
};

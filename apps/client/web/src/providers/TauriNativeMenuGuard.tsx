import { target, useEventListener } from '@siberiacancode/reactuse';
import { isTauri } from '@tauri-apps/api/core';

import { allowsNativeContextMenu } from '@/shared/lib';

export const TauriNativeMenuGuard = () => {
  useEventListener(target(document), 'contextmenu', (event) => {
    if (!isTauri() || import.meta.env.MODE !== 'production') {
      return;
    }

    if (!allowsNativeContextMenu(event.target)) {
      event.preventDefault();
    }
  });

  return null;
};

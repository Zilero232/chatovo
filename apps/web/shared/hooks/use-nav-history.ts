'use client';

import { useStateHistory } from '@siberiacancode/reactuse';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useNavHistory = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { value, index, history, canUndo, canRedo, set, undo, redo } = useStateHistory(pathname);

  useEffect(() => {
    if (pathname !== value) {
      set(pathname);
    }
    // eslint-disable-next-line react/exhaustive-deps -- track pathname only; set is a new ref each render
  }, [pathname, value]);

  const goBack = () => {
    if (!canUndo) {
      return;
    }

    undo();

    router.push(history[index - 1]);
  };

  const goForward = () => {
    if (!canRedo) {
      return;
    }

    redo();

    router.push(history[index + 1]);
  };

  return { canGoBack: canUndo, canGoForward: canRedo, goBack, goForward };
};

import { useStateHistory } from '@siberiacancode/reactuse';
import { useLocation, useRouter } from '@tanstack/react-router';
import { useEffect } from 'react';

export const useNavHistory = () => {
  const router = useRouter();
  const pathname = useLocation({ select: (location) => location.pathname });

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

    router.history.push(history[index - 1]);
  };

  const goForward = () => {
    if (!canRedo) {
      return;
    }

    redo();

    router.history.push(history[index + 1]);
  };

  return { canGoBack: canUndo, canGoForward: canRedo, goBack, goForward };
};

import { useLocation } from '@tanstack/react-router';

import { ROUTES } from '@/shared/constants';

import { useRunWhen } from './use-run-when';

export const useCloseWhenInVoiceRoom = (close: () => void) => {
  const pathname = useLocation({ select: (location) => location.pathname });

  useRunWhen(pathname === ROUTES.room, close);
};

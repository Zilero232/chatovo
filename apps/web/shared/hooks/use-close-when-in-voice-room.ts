'use client';

import { usePathname } from 'next/navigation';

import { ROUTES } from '@/shared/constants';

import { useRunWhen } from './use-run-when';

export const useCloseWhenInVoiceRoom = (close: () => void) => {
  const pathname = usePathname();

  useRunWhen(pathname === ROUTES.room, close);
};

'use client';

import type { ReactNode } from 'react';

import { useShortcutsBridge } from '@/features/app/shortcuts';
import { isTauriDesktop } from '@/shared/lib';

const ShortcutsBridge = ({ children }: { children: ReactNode }) => {
  useShortcutsBridge();

  return <>{children}</>;
};

export const ShortcutsProvider = ({ children }: { children: ReactNode }) => {
  if (!isTauriDesktop()) {
    return <>{children}</>;
  }

  return <ShortcutsBridge>{children}</ShortcutsBridge>;
};

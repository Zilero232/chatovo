'use client';

import { useEffect } from 'react';

import { isTauriDesktop } from '@/shared/lib';

export const TauriDesktopDocumentClass = () => {
  useEffect(() => {
    if (!isTauriDesktop()) {
      return;
    }

    document.documentElement.classList.add('tauri-desktop');

    return () => {
      document.documentElement.classList.remove('tauri-desktop');
    };
  }, []);

  return null;
};

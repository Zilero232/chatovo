'use client';

import { target, useEventListener } from '@siberiacancode/reactuse';
import { useEffect } from 'react';

import { isTauriMobile } from '@/shared/lib';

const syncInsetsFromPlugin = async () => {
  if (!isTauriMobile()) {
    return;
  }

  const api = await import('@saurl/tauri-plugin-safe-area-insets-css-api');
  const [top, bottom] = await Promise.all([api.getTopInset(), api.getBottomInset()]);

  const root = document.documentElement;

  if (top?.inset != null) {
    root.style.setProperty('--safe-area-inset-top', `${top.inset}px`);
  }

  if (bottom?.inset != null) {
    root.style.setProperty('--safe-area-inset-bottom', `${bottom.inset}px`);
  }
};

const syncInsets = () => {
  void syncInsetsFromPlugin();
};

export const TauriMobileInsets = () => {
  useEventListener(target(window), 'resize', syncInsets);

  useEffect(() => {
    if (!isTauriMobile()) {
      return;
    }

    const root = document.documentElement;
    root.classList.add('tauri-mobile');

    void syncInsetsFromPlugin();

    const viewport = window.visualViewport;
    viewport?.addEventListener('resize', syncInsets);

    return () => {
      root.classList.remove('tauri-mobile');
      root.style.removeProperty('--safe-area-inset-top');
      root.style.removeProperty('--safe-area-inset-bottom');
      viewport?.removeEventListener('resize', syncInsets);
    };
  }, []);

  return null;
};

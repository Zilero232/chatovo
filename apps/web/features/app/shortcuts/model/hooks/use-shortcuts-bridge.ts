'use client';

import { useEffect } from 'react';

import { useAppSettings } from '@/entities/app/settings';
import { isTauriDesktop } from '@/shared/lib';

import { syncShortcuts, teardownShortcuts } from '../../lib/shortcuts-registry';

export const useShortcutsBridge = () => {
  const { settings } = useAppSettings();

  useEffect(() => {
    if (!isTauriDesktop()) {
      return;
    }

    syncShortcuts(settings.shortcuts);
  }, [settings.shortcuts]);

  useEffect(() => {
    if (!isTauriDesktop()) {
      return;
    }

    return () => {
      teardownShortcuts();
    };
  }, []);
};

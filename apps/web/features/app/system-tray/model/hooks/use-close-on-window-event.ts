'use client';

import { isTauri } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useEffect, useEffectEvent } from 'react';

import { useAppSettings } from '@/entities/app/settings';
import { hideMainWindow } from '@/shared/lib';

export const useCloseOnWindowEvent = () => {
  const { settings } = useAppSettings();

  const getCloseToTray = useEffectEvent(() => settings.system.tray.closeToTray);

  useEffect(() => {
    if (!isTauri()) {
      return;
    }

    let cancelled = false;
    let unlisten: (() => void) | null = null;

    const subscribe = async () => {
      try {
        const off = await getCurrentWindow().onCloseRequested((event) => {
          if (!getCloseToTray()) {
            return;
          }

          event.preventDefault();

          hideMainWindow();
        });

        if (cancelled) {
          off();
        } else {
          unlisten = off;
        }
      } catch (error) {
        console.error('Failed to subscribe to onCloseRequested', error);
      }
    };

    subscribe();

    return () => {
      cancelled = true;
      unlisten?.();
    };
  }, []);
};

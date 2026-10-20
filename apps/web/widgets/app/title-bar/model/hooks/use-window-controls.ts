'use client';

import { useEffect, useState } from 'react';

import { useAppSettings } from '@/entities/app/settings';
import {
  closeMainWindow,
  hideMainWindow,
  isMainWindowMaximized,
  isTauriDesktop,
  minimizeMainWindow,
  onMainWindowResized,
  toggleMaximizeMainWindow
} from '@/shared/lib';

export const useWindowControls = () => {
  const { settings } = useAppSettings();

  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (!isTauriDesktop()) {
      return;
    }

    let unlisten: (() => void) | undefined;

    const setup = async () => {
      setIsMaximized(await isMainWindowMaximized());

      unlisten = await onMainWindowResized(async () => {
        setIsMaximized(await isMainWindowMaximized());
      });
    };

    setup();

    return () => {
      unlisten?.();
    };
  }, []);

  const close = async () => {
    if (settings.system.tray.closeToTray) {
      return await hideMainWindow();
    }

    await closeMainWindow();
  };

  return {
    isMaximized,
    minimize: minimizeMainWindow,
    toggleMaximize: toggleMaximizeMainWindow,
    close
  };
};

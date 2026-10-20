'use client';

import type { ReactNode } from 'react';

import { useTranslations } from 'next-intl';
import { useEffect, useEffectEvent } from 'react';

import {
  localizeTray,
  subscribeTrayAction,
  useCloseOnWindowEvent
} from '@/features/app/system-tray';
import { appEvents, isTauriDesktop } from '@/shared/lib';

export const TrayMenuProvider = ({ children }: { children: ReactNode }) => {
  const t = useTranslations('tray');

  useCloseOnWindowEvent();

  const localize = useEffectEvent(() => {
    void localizeTray({
      status: t('status.online'),
      mute: t('mute'),
      deafen: t('deafen'),
      leaveRoom: t('leaveRoom'),
      openApp: t('openApp'),
      checkUpdates: t('checkUpdates'),
      quit: t('quit')
    });
  });

  useEffect(() => {
    if (!isTauriDesktop()) {
      return;
    }

    localize();

    const action = subscribeTrayAction((next) => {
      if (next === 'checkUpdates') {
        appEvents.emit.recheckUpdate();
      }
    });

    return () => {
      void action.then((off) => off());
    };
  }, []);

  return children;
};

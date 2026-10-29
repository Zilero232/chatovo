import type { DmCallView } from '@chatovo/schemas';

import { isTauri } from '@tauri-apps/api/core';
import { useEffect, useEffectEvent, useRef } from 'react';
import { useTranslations } from 'use-intl';

import { isTauriDesktop, requestMainWindowAttention } from '@/shared/lib';

import { CALL_ATTENTION } from '../../config';

const canNotify = () => !isTauri() && typeof Notification !== 'undefined';

export const useCallAttention = (incoming: DmCallView | null) => {
  const t = useTranslations('friends.incomingCall');

  const notificationRef = useRef<Notification | null>(null);

  const incomingId = incoming?.id ?? null;

  const announce = useEffectEvent(() => {
    if (!incoming) {
      return;
    }

    if (isTauriDesktop()) {
      void requestMainWindowAttention();
    }

    if (document.hidden && canNotify() && Notification.permission === 'granted') {
      const notification = new Notification(t('title'), {
        body: t('description', { name: incoming.peer.name }),
        tag: `dm-call-${incoming.id}`,
        requireInteraction: true
      });

      notification.addEventListener('click', () => {
        window.focus();
        notification.close();
      });

      notificationRef.current = notification;
    }
  });

  const readFlashTitle = useEffectEvent(() => t('titleFlash', { name: incoming?.peer.name ?? '' }));

  useEffect(() => {
    if (!incomingId) {
      return;
    }

    announce();

    const baseTitle = document.title;
    let isFlashed = false;

    const timer = setInterval(() => {
      isFlashed = document.hidden && !isFlashed;
      document.title = isFlashed ? readFlashTitle() : baseTitle;
    }, CALL_ATTENTION.titleFlashMs);

    return () => {
      clearInterval(timer);

      if (isFlashed) {
        document.title = baseTitle;
      }

      notificationRef.current?.close();
      notificationRef.current = null;
    };
  }, [incomingId]);

  const primeNotifications = () => {
    if (canNotify() && Notification.permission === 'default') {
      void Notification.requestPermission();
    }
  };

  return { primeNotifications };
};

import { useEffect, useEffectEvent } from 'react';
import {
  checkPermissions,
  createChannel,
  getToken,
  onTokenRefresh,
  register,
  requestPermissions
} from 'tauri-plugin-fcm';
import { useLocale, useTranslations } from 'use-intl';

import { registerPushDevice } from '@/shared/api';
import { isTauriMobile } from '@/shared/lib';

import { PUSH_CHANNELS } from '../../config';
import { resolvePushPlatform } from '../../lib';

export const usePushRegistration = (enabled: boolean): void => {
  const t = useTranslations('pushChannels');
  const locale = useLocale();

  const createChannels = useEffectEvent(async () => {
    for (const { id, importance } of PUSH_CHANNELS) {
      await createChannel({ id, importance, name: t(id) });
    }
  });

  useEffect(() => {
    if (!enabled || !isTauriMobile()) {
      return;
    }

    const platform = resolvePushPlatform();

    if (!platform) {
      return;
    }

    let tokenListener: Awaited<ReturnType<typeof onTokenRefresh>> | null = null;
    let cancelled = false;

    const setup = async () => {
      await createChannels();

      let permission = await checkPermissions();

      if (permission !== 'granted') {
        permission = await requestPermissions();
      }

      if (permission !== 'granted') {
        console.warn('[push] notification permission not granted:', permission);

        return;
      }

      if (cancelled) {
        return;
      }

      await register();

      const { token } = await getToken();

      if (cancelled) {
        return;
      }

      if (!token) {
        console.warn('[push] FCM returned an empty token');

        return;
      }

      await registerPushDevice({ token, platform, locale });

      tokenListener = await onTokenRefresh(async (event) => {
        try {
          await registerPushDevice({ token: event.token, platform, locale });
        } catch (error) {
          console.error('[push] failed to persist refreshed token', error);
        }
      });
    };

    setup().catch((error: unknown) => {
      console.error('[push] registration failed', error);
    });

    return () => {
      cancelled = true;
      void tokenListener?.unregister();
    };
  }, [enabled, locale]);
};

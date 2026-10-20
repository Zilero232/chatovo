'use client';

import type { Update } from '@tauri-apps/plugin-updater';

import { useCounter } from '@siberiacancode/reactuse';
import { relaunch } from '@tauri-apps/plugin-process';
import { check } from '@tauri-apps/plugin-updater';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { clamp } from 'remeda';
import { toast } from 'sonner';
import { match } from 'ts-pattern';

import { appEvents, isTauriDesktop, raceWithTimeout } from '@/shared/lib';

import type { UpdateInfo } from '../types';

import { APP_UPDATE_CONFIG } from '../../config/config';

export const useCheckAppUpdate = () => {
  const t = useTranslations('update');

  const [update, setUpdate] = useState<Update | null>(null);
  const [status, setStatus] = useState<UpdateInfo['status']>(() =>
    isTauriDesktop() ? 'checking' : 'idle'
  );
  const [progress, setProgress] = useState(0);
  const [silent, setSilent] = useState(true);

  const recheckTick = useCounter(0);
  const hasCheckedOnceRef = useRef(false);
  const isManualRef = useRef(false);

  const runInstall = async (target: Update) => {
    setStatus('downloading');
    setProgress(0);

    let downloaded = 0;
    let total = 0;

    try {
      await target.downloadAndInstall((event) => {
        match(event)
          .with({ event: 'Started' }, ({ data }) => {
            total = data.contentLength ?? 0;
          })
          .with({ event: 'Progress' }, ({ data }) => {
            downloaded += data.chunkLength;

            const percent = total > 0 ? Math.round((downloaded / total) * 100) : 0;

            setProgress(clamp(percent, { min: 0, max: 100 }));
          })
          .with({ event: 'Finished' }, () => {
            setStatus('installing');
            setProgress(100);
          })
          .exhaustive();
      });

      await relaunch();
    } catch (err) {
      console.error('Update install failed', err);
      setStatus('error');
    }
  };

  useEffect(() => {
    if (!isTauriDesktop()) {
      return;
    }

    let cancelled = false;

    const run = async () => {
      const isManual = isManualRef.current;

      setSilent(!isManual);

      if (!hasCheckedOnceRef.current) {
        setStatus('checking');
      }

      try {
        const result = await raceWithTimeout({
          promise: check(),
          timeoutMs: APP_UPDATE_CONFIG.checkTimeoutMs
        });

        if (cancelled) {
          return;
        }

        hasCheckedOnceRef.current = true;

        if (!result.ok) {
          if (isManual) {
            toast.error(t('checkTimedOut'), { id: 'app-update-check' });
          }

          return setStatus('unavailable');
        }

        if (!result.value) {
          if (isManual) {
            toast.success(t('upToDate'), { id: 'app-update-check' });
          }

          return setStatus('unavailable');
        }

        setUpdate(result.value);

        if (isManual) {
          setStatus('available');
        } else {
          await runInstall(result.value);
        }
      } catch (err) {
        console.error('Update check failed', err);

        if (!cancelled) {
          hasCheckedOnceRef.current = true;
          setStatus('unavailable');

          if (isManualRef.current) {
            toast.error(t('checkFailed'), { id: 'app-update-check' });
          }
        }
      } finally {
        if (isManualRef.current) {
          appEvents.emit.updateCheckSettled();
        }

        isManualRef.current = false;
      }
    };

    run();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react/exhaustive-deps -- recheckTick.value is the manual re-trigger; bumping it must re-run the effect
  }, [recheckTick.value]);

  appEvents.on.recheckUpdate(() => {
    if (!isTauriDesktop()) {
      return;
    }

    isManualRef.current = true;
    recheckTick.inc();
  });

  const install = async () => {
    if (!update) {
      return;
    }

    await runInstall(update);
  };

  const dismiss = () => {
    setStatus('unavailable');
    setUpdate(null);
  };

  return {
    status,
    currentVersion: update?.currentVersion ?? null,
    version: update?.version ?? null,
    date: update?.date ?? null,
    progress,
    silent,
    install,
    dismiss
  };
};

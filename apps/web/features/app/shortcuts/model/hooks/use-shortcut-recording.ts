'use client';

import { target, useBoolean, useEventListener } from '@siberiacancode/reactuse';
import { isTauri } from '@tauri-apps/api/core';
import { useTranslations } from 'next-intl';
import { useEffect, useEffectEvent, useRef } from 'react';
import { toast } from 'sonner';

import type { ShortcutActionId, ShortcutSettings } from '@/entities/app/shortcut';

import { formatHotkey, hasModifier, isPureModifier } from '@/shared/lib';

import { buildShortcutPatch, isOwnedByUs } from '../../lib/build-shortcut-patch';
import { probeOsAvailability } from '../../lib/probe-os-availability';
import { syncShortcuts, teardownShortcuts } from '../../lib/shortcuts-registry';

type Options = {
  actionId: ShortcutActionId;
  allBindings: ShortcutSettings;
  onPatch: (patch: Partial<ShortcutSettings>) => void;
};

type Result = {
  recording: boolean;
  start: () => void;
};

export const useShortcutRecording = ({ actionId, allBindings, onPatch }: Options): Result => {
  const t = useTranslations('settings.shortcuts');
  const [recording, toggleRecording] = useBoolean(false);

  const isTornDownRef = useRef(false);

  const start = () => {
    toggleRecording(true);

    if (isTauri()) {
      isTornDownRef.current = true;

      teardownShortcuts();
    }
  };

  const cancel = () => {
    toggleRecording(false);

    if (isTauri() && isTornDownRef.current) {
      isTornDownRef.current = false;

      syncShortcuts(allBindings);
    }
  };

  const restoreShortcuts = useEffectEvent(() => syncShortcuts(allBindings));

  useEffect(
    () => () => {
      if (isTauri() && isTornDownRef.current) {
        restoreShortcuts();
      }
    },
    []
  );

  useEventListener(
    target(window),
    'keydown',
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.key === 'Escape') {
        return cancel();
      }

      if (isPureModifier(e.key)) {
        return;
      }

      const hotkey = formatHotkey(e);
      if (!hotkey) {
        return;
      }

      if (!hasModifier(hotkey)) {
        toast.error(t('errors.needsModifier'), { id: `shortcut-record-${actionId}` });

        return cancel();
      }

      const free = isOwnedByUs(hotkey, allBindings) || (await probeOsAvailability(hotkey));

      if (!free) {
        toast.error(t('errors.systemTaken'), { id: `shortcut-record-${actionId}` });

        return cancel();
      }

      toggleRecording(false);

      isTornDownRef.current = false;

      onPatch(buildShortcutPatch(actionId, hotkey, allBindings));
    },
    { enabled: recording, capture: true }
  );

  return { recording, start };
};

'use client';

import { useLocalStorage } from '@siberiacancode/reactuse';
import { useMemo } from 'react';

import { STORAGE_KEYS } from '@/shared/constants';

import type { AppSettings, UseAppSettings } from '../types';

import { DEFAULT_APP_SETTINGS } from '../../config/config';
import { readAppSettings, withAppSettingsDefaults } from '../../lib/read-app-settings';

export const useAppSettings = (): UseAppSettings => {
  const { value, set } = useLocalStorage<AppSettings>(
    STORAGE_KEYS.appSettings,
    DEFAULT_APP_SETTINGS
  );

  const settings = useMemo(() => withAppSettingsDefaults(value), [value]);

  const setGroup: UseAppSettings['setGroup'] = (group, patch) => {
    const current = readAppSettings();

    set({ ...current, [group]: { ...current[group], ...patch } });
  };

  const toggleSound: UseAppSettings['toggleSound'] = (category) => {
    const current = readAppSettings();

    setGroup('sounds', {
      enabled: { ...current.sounds.enabled, [category]: !current.sounds.enabled[category] }
    });
  };

  return { settings, setGroup, toggleSound };
};

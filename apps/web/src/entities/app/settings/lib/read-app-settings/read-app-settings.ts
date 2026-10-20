import { mergeDeep } from 'remeda';

import { STORAGE_KEYS } from '@/shared/constants';
import { readStoredJson } from '@/shared/lib';

import type { AppSettings } from '../../model/types';

import { DEFAULT_APP_SETTINGS } from '../../config/config';

export const withAppSettingsDefaults = (
  value: Partial<AppSettings> | null | undefined
): AppSettings => mergeDeep(DEFAULT_APP_SETTINGS, value ?? {}) as AppSettings;

export const readAppSettings = (): AppSettings =>
  withAppSettingsDefaults(
    readStoredJson<Partial<AppSettings> | null>(STORAGE_KEYS.appSettings, null)
  );

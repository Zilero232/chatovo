import { isTauri } from '@tauri-apps/api/core';
import { type as osType } from '@tauri-apps/plugin-os';

export const isTauriMobile = (): boolean => {
  if (!isTauri()) {
    return false;
  }

  const type = osType();

  return type === 'android' || type === 'ios';
};

export const isTauriDesktop = (): boolean => isTauri() && !isTauriMobile();

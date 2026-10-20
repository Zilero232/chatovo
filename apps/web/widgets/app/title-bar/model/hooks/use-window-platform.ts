'use client';

import type { Platform } from '@tauri-apps/plugin-os';

import { platform } from '@tauri-apps/plugin-os';
import { useState } from 'react';

import { isTauriDesktop } from '@/shared/lib';

export const useWindowPlatform = () => {
  const [os] = useState<Platform | null>(() => (isTauriDesktop() ? platform() : null));

  return os;
};

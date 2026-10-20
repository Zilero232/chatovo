import type { PushPlatform } from '@chatovo/schemas';

import { type as osType } from '@tauri-apps/plugin-os';

export const resolvePushPlatform = (): PushPlatform | null => {
  const type = osType();

  if (type === 'android' || type === 'ios') {
    return type;
  }

  return null;
};

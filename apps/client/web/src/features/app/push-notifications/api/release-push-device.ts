import { getToken } from 'tauri-plugin-fcm';

import { unregisterPushDevice } from '@/shared/api';
import { isTauriMobile } from '@/shared/lib';

export const releasePushDevice = async (): Promise<void> => {
  if (!isTauriMobile()) {
    return;
  }

  const { token } = await getToken();

  if (token) {
    await unregisterPushDevice({ token });
  }
};

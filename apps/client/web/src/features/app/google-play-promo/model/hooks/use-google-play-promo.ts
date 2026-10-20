import { useLocalStorage } from '@siberiacancode/reactuse';

import { STORAGE_KEYS } from '@/shared/constants';
import { isTauriMobile } from '@/shared/lib';

export const useGooglePlayPromo = () => {
  const { value: isDismissed, set } = useLocalStorage<boolean>(
    STORAGE_KEYS.googlePlayPromoDismissed,
    false
  );

  const dismiss = () => set(true);

  return { isVisible: !isDismissed && !isTauriMobile(), dismiss };
};

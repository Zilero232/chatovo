import { values } from 'remeda';

import type { ShortcutActionId, ShortcutSettings } from '@/entities/app/shortcut';

export const buildShortcutPatch = (
  actionId: ShortcutActionId,
  hotkey: string,
  current: ShortcutSettings
): Partial<ShortcutSettings> => {
  const patch: Partial<ShortcutSettings> = { [actionId]: hotkey };

  for (const id in current) {
    const otherId = id as ShortcutActionId;

    if (otherId !== actionId && current[otherId] === hotkey) {
      patch[otherId] = null;
    }
  }

  return patch;
};

export const isOwnedByUs = (hotkey: string, current: ShortcutSettings): boolean =>
  values(current).includes(hotkey);

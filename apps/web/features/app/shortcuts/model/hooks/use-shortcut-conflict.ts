'use client';

import { conflictsStoreApi } from '../stores/conflicts';

export const useShortcutConflict = (hotkey: string | null | undefined): boolean =>
  conflictsStoreApi.use((state) => (hotkey ? state.items.has(hotkey) : false));

import { useConflictsStore } from '../stores/conflicts';

export const useShortcutConflict = (hotkey: string | null | undefined): boolean =>
  useConflictsStore((state) => (hotkey ? state.items.has(hotkey) : false));

'use client';

import { useLocalStorage } from '@siberiacancode/reactuse';
import { isArray } from 'remeda';

import { STORAGE_KEYS } from '@/shared/constants';
import { readStoredJson } from '@/shared/lib';

const MAX_RECENT = 6;

type RecentEntry = {
  id: string;
  visitedAt: number;
};

export const useRecentRooms = () => {
  const { value, set } = useLocalStorage<RecentEntry[]>(STORAGE_KEYS.recentRooms, []);

  const recent = value ?? [];

  const readRecent = (): RecentEntry[] => {
    const stored = readStoredJson<unknown>(STORAGE_KEYS.recentRooms, null);

    return isArray(stored) ? (stored as RecentEntry[]) : recent;
  };

  const push = (id: string) => {
    const filtered = readRecent().filter((entry) => entry.id !== id);

    set([{ id, visitedAt: Date.now() }, ...filtered].slice(0, MAX_RECENT));
  };

  const remove = (id: string) => {
    set(readRecent().filter((entry) => entry.id !== id));
  };

  return { recent, push, remove };
};

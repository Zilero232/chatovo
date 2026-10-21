import type { UserBlockEntry } from '@chatovo/schemas';

import type { AddUserBlockEntryInput, RemoveUserBlockEntryInput } from './user-block-entries.types';

export const addUserBlockEntry = ({
  entries,
  entry
}: AddUserBlockEntryInput): UserBlockEntry[] | undefined => {
  if (!entries) {
    return entries;
  }

  return [entry, ...entries.filter((item) => item.user.id !== entry.user.id)];
};

export const removeUserBlockEntry = ({
  entries,
  userId
}: RemoveUserBlockEntryInput): UserBlockEntry[] | undefined => {
  if (!entries) {
    return entries;
  }

  return entries.filter((item) => item.user.id !== userId);
};

export const toBlockedUserIds = (entries: UserBlockEntry[]): ReadonlySet<string> =>
  new Set(entries.map((entry) => entry.user.id));

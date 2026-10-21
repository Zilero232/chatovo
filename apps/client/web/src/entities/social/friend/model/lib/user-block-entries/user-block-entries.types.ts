import type { UserBlockEntry } from '@chatovo/schemas';

export type AddUserBlockEntryInput = {
  entries: UserBlockEntry[] | undefined;
  entry: UserBlockEntry;
};

export type RemoveUserBlockEntryInput = {
  entries: UserBlockEntry[] | undefined;
  userId: string;
};

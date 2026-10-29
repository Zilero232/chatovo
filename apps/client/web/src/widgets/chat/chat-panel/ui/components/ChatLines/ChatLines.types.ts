import type { GroupedChatLine } from '../../../model/lib';

export type ChatLineActions = {
  discard: (id: string) => void;
  edit: (id: string, body: string) => void;
  remove: (id: string) => void;
  retry: (id: string, body: string) => void;
};

export type ChatLinesProps = {
  actions: ChatLineActions;
  canModerate: boolean;
  isReadOnly: boolean;
  lines: GroupedChatLine[];
  peerId: string | null;
};

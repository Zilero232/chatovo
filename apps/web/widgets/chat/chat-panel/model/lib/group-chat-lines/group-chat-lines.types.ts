import type { ChatLine } from '../../types';

export type GroupedChatLine = {
  isGrouped: boolean;
  isOwn: boolean;
  isTail: boolean;
  line: ChatLine;
  showDivider: boolean;
};

export type GroupChatLinesInput = {
  lines: ChatLine[];
  ownIdentity: string;
};

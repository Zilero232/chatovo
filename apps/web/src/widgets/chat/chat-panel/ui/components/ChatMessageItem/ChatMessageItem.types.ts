import type { ChatLine } from '../../../model/types';

export type ChatMessageItemProps = {
  canManage: boolean;
  isGrouped: boolean;
  isOwn: boolean;
  isTail: boolean;
  message: ChatLine;
  onDelete: (id: string) => void;
  onDiscard: (id: string) => void;
  onEdit: (id: string, body: string) => void;
  onRetry: (id: string, body: string) => void;
};

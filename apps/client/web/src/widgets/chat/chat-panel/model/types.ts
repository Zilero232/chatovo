import type { ChatCallLog, UserRole } from '@chatovo/schemas';

export type ChatLineStatus = 'failed' | 'sending';

export type ChatLine = {
  call?: ChatCallLog | null;
  deletedAt?: number | null;
  editedAt?: number | null;
  from?: {
    identity: string;
    name?: string;
    metadata?: string;
    role?: UserRole;
  };
  id: string;
  message: string;
  status?: ChatLineStatus;
  timestamp: number;
};

export type ChatHistoryPage = {
  lines: ChatLine[];
  nextCursor: string | null;
};

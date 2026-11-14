import type { AdminUserMessageQuery } from '@chatovo/schemas';

export type UseAdminRoomMessagesInput = {
  roomId: string;
  query: AdminUserMessageQuery;
  enabled: boolean;
};

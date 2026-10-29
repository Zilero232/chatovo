import type { z } from 'zod';

import type {
  createRoomInputSchema,
  roomPasswordFormSchema,
  updateRoomInputSchema
} from './inputs';
import type {
  roomBanSchema,
  roomKindSchema,
  roomModerationActionSchema,
  roomSchema
} from './outputs';

export type Room = z.infer<typeof roomSchema>;
export type RoomKind = z.infer<typeof roomKindSchema>;
export type RoomBan = z.infer<typeof roomBanSchema>;
export type RoomModerationAction = z.infer<typeof roomModerationActionSchema>;

export type CreateRoomRequest = z.infer<typeof createRoomInputSchema>;
export type RoomPasswordFormValues = z.infer<typeof roomPasswordFormSchema>;
export type UpdateRoomRequest = z.infer<typeof updateRoomInputSchema>;

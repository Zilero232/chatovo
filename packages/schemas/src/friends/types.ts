import type { z } from 'zod';

import type { callIdParamSchema, sendFriendRequestInputSchema } from './inputs';
import type {
  dmCallDirectionSchema,
  dmCallEndReasonSchema,
  dmCallsSnapshotSchema,
  dmCallStateSchema,
  dmCallViewSchema,
  friendCallStatusSchema,
  friendCallStreamSnapshotSchema,
  friendEntrySchema,
  friendRequestEntrySchema,
  friendshipRelationSchema,
  friendUserSchema,
  incomingFriendCallResponseSchema,
  incomingFriendCallSchema,
  outgoingFriendCallResponseSchema,
  outgoingFriendCallSchema,
  userBlockEntrySchema
} from './outputs';

export type FriendCallStatus = z.infer<typeof friendCallStatusSchema>;
export type FriendCallStreamSnapshot = z.infer<typeof friendCallStreamSnapshotSchema>;
export type FriendUser = z.infer<typeof friendUserSchema>;
export type FriendEntry = z.infer<typeof friendEntrySchema>;
export type FriendRequestEntry = z.infer<typeof friendRequestEntrySchema>;
export type FriendshipRelation = z.infer<typeof friendshipRelationSchema>;
export type IncomingFriendCall = z.infer<typeof incomingFriendCallSchema>;
export type IncomingFriendCallResponse = z.infer<typeof incomingFriendCallResponseSchema>;
export type OutgoingFriendCall = z.infer<typeof outgoingFriendCallSchema>;
export type OutgoingFriendCallResponse = z.infer<typeof outgoingFriendCallResponseSchema>;
export type SendFriendRequestInput = z.infer<typeof sendFriendRequestInputSchema>;
export type UserBlockEntry = z.infer<typeof userBlockEntrySchema>;

export type CallIdParam = z.infer<typeof callIdParamSchema>;
export type DmCallDirection = z.infer<typeof dmCallDirectionSchema>;
export type DmCallEndReason = z.infer<typeof dmCallEndReasonSchema>;
export type DmCallState = z.infer<typeof dmCallStateSchema>;
export type DmCallView = z.infer<typeof dmCallViewSchema>;
export type DmCallsSnapshot = z.infer<typeof dmCallsSnapshotSchema>;

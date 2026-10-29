import { z } from 'zod';

export const friendUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  friendTag: z.string(),
  avatarUrl: z.string().nullable(),
  verified: z.boolean(),
  developer: z.boolean().default(false),
  isOnline: z.boolean()
});

export const friendEntrySchema = z.object({
  friendshipId: z.string(),
  user: friendUserSchema,
  since: z.string()
});

export const friendRequestEntrySchema = z.object({
  friendshipId: z.string(),
  user: friendUserSchema,
  requestedAt: z.string()
});

export const friendListSchema = z.array(friendEntrySchema);
export const friendRequestListSchema = z.array(friendRequestEntrySchema);

export const friendshipRelationSchema = z.discriminatedUnion('status', [
  z.object({ status: z.literal('none') }),
  z.object({
    status: z.literal('friends'),
    friendshipId: z.string()
  }),
  z.object({
    status: z.literal('outgoing_pending'),
    friendshipId: z.string()
  }),
  z.object({
    status: z.literal('incoming_pending'),
    friendshipId: z.string()
  }),
  z.object({ status: z.literal('blocked') })
]);

export const userBlockEntrySchema = z.object({
  user: friendUserSchema,
  blockedAt: z.string()
});

export const userBlockListSchema = z.array(userBlockEntrySchema);

export const incomingFriendCallSchema = z.object({
  roomId: z.uuid(),
  caller: friendUserSchema
});

export const incomingFriendCallResponseSchema = z.object({
  call: incomingFriendCallSchema.nullable()
});

export const friendCallStatusSchema = z.enum(['ringing', 'accepted', 'declined']);

export const outgoingFriendCallSchema = z.object({
  roomId: z.uuid(),
  callee: friendUserSchema,
  status: friendCallStatusSchema
});

export const outgoingFriendCallResponseSchema = z.object({
  call: outgoingFriendCallSchema.nullable()
});

export const dmCallStateSchema = z.enum(['ringing', 'active', 'ended']);

export const dmCallEndReasonSchema = z.enum([
  'completed',
  'declined',
  'cancelled',
  'missed',
  'busy',
  'failed',
  'blocked'
]);

export const dmCallDirectionSchema = z.enum(['outgoing', 'incoming']);

// One 1:1 call as the viewer sees it. Timestamps are ISO strings from the server clock.
export const dmCallViewSchema = z.object({
  id: z.uuid(),
  roomId: z.uuid(),
  direction: dmCallDirectionSchema,
  peer: friendUserSchema,
  state: dmCallStateSchema,
  startedAt: z.string(),
  ringEndsAt: z.string().nullable(),
  answeredAt: z.string().nullable(),
  endedAt: z.string().nullable(),
  endReason: dmCallEndReasonSchema.nullable(),
  // Ringing: at least one of the callee's sockets or a push token was reached.
  calleeReachable: z.boolean(),
  // The other side is already in another call (call waiting).
  peerBusy: z.boolean(),
  peerInCall: z.boolean(),
  selfInCall: z.boolean(),
  // Active call whose peer dropped without hanging up: when the call ends unless they return.
  peerGraceEndsAt: z.string().nullable()
});

export const dmCallsSnapshotSchema = z.object({
  // The viewer's own call: outgoing ringing, active, or just ended (kept a few seconds).
  current: dmCallViewSchema.nullable(),
  // A call ringing the viewer; may coexist with an active `current` (call waiting).
  incoming: dmCallViewSchema.nullable()
});

export const friendCallStreamSnapshotSchema = z.object({
  // Legacy shape for installed apps that bundle an older client; never add values to its enums.
  incoming: incomingFriendCallSchema.nullable(),
  outgoing: outgoingFriendCallSchema.nullable(),
  friendsEpoch: z.number().int().nonnegative(),
  calls: dmCallsSnapshotSchema.default({ current: null, incoming: null })
});

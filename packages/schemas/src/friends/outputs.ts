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

export const friendCallStreamSnapshotSchema = z.object({
  incoming: incomingFriendCallSchema.nullable(),
  outgoing: outgoingFriendCallSchema.nullable(),
  friendsEpoch: z.number().int().nonnegative()
});

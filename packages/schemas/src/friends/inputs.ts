import { z } from 'zod';

export const callIdParamSchema = z.object({
  callId: z.uuid()
});

export const sendFriendRequestInputSchema = z.object({
  tag: z.string().min(3)
});

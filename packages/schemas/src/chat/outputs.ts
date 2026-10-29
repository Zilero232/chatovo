import { z } from 'zod';

import { USER_ROLE, userRoleSchema } from '../auth/inputs';
import { IMAGE_PLACEHOLDER_MAX_LENGTH } from './limits';

export const chatAttachmentImageSchema = z.object({
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  placeholder: z
    .string()
    .max(IMAGE_PLACEHOLDER_MAX_LENGTH)
    .regex(/^data:image\/webp;base64,[\w+/=]+$/)
});

export const chatAttachmentSchema = z.object({
  kind: z.literal('attachment'),
  url: z.url(),
  name: z.string().min(1).max(255),
  size: z.number().int().nonnegative(),
  mime: z.string().min(1).max(255),
  image: chatAttachmentImageSchema.optional()
});

export const chatMessageSchema = z.object({
  id: z.uuid(),
  roomId: z.uuid(),
  senderId: z.string().nullable(),
  senderName: z.string(),
  senderRole: userRoleSchema.catch(USER_ROLE.user),
  body: z.string(),
  createdAt: z.string(),
  editedAt: z.string().nullable(),
  deletedAt: z.string().nullable()
});

export const chatMessagesPageSchema = z.object({
  items: z.array(chatMessageSchema),
  nextCursor: z.string().nullable()
});

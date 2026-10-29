import { z } from 'zod';

import { USER_ROLE, userRoleSchema } from '../auth/inputs';

export const abuseReasonSchema = z.enum([
  'spam',
  'harassment',
  'hate',
  'sexual',
  'violence',
  'illegal',
  'other'
]);

export const abuseTargetSchema = z.enum(['user', 'message', 'room']);

// An untouched textarea submits an empty string; normalise it away so the
// server stores null instead of a blank comment.
const commentSchema = z
  .string()
  .trim()
  .max(2000, 'validation.abuseCommentMax')
  .optional()
  .transform((value) => value || undefined);

// One endpoint covers all three targets — `targetId` is the reported user, the
// message or the room. The room a report belongs to is resolved server-side, so
// a caller cannot file a report against a room they picked themselves.
export const reportAbuseSchema = z.object({
  target: abuseTargetSchema,
  targetId: z.string().min(1),
  reason: abuseReasonSchema,
  comment: commentSchema
});

export const blockUserSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(3, 'validation.blockReasonMin')
    .max(500, 'validation.blockReasonMax')
});

const listQueryFields = {
  search: z.string().trim().max(120).optional(),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(25)
};

export const adminUserFilterSchema = z.enum(['all', 'blocked', 'staff', 'online']);

export const adminUserQuerySchema = z.object({
  ...listQueryFields,
  filter: adminUserFilterSchema.default('all')
});

export const adminRoomQuerySchema = z.object(listQueryFields);

export const adminReportQuerySchema = z.object({
  ...listQueryFields,
  handled: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true')
});

// Only the fields a moderator may correct: identity and the abuse flags stay
// with their own endpoints, and email is owned by better-auth.
export const updateAdminUserSchema = z
  .object({
    displayName: z.string().trim().min(2).max(32).nullable(),
    bio: z.string().trim().max(280).nullable(),
    profileUrl: z.string().trim().max(200).nullable(),
    verified: z.boolean(),
    developer: z.boolean(),
    role: userRoleSchema.exclude([USER_ROLE.owner])
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'At least one field required');

export const adminUserMessageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(30)
});

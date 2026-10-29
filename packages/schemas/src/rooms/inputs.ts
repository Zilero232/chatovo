import { z } from 'zod';

import { roomSchema } from './outputs';

// Shared room-password rule (min 4). Used by the join form where the field is
// required; the create/update path wraps it as optional below.
export const roomPasswordSchema = z
  .string()
  .trim()
  .min(4, 'validation.passwordMin')
  .max(128, 'validation.passwordMax');

export const roomPasswordFormSchema = z.object({ password: roomPasswordSchema });

// Treat empty string as "no password" so an untouched form field never fails
// the (min 4) check; downstream code only needs to handle `string | undefined`.
const passwordSchema = roomPasswordSchema.optional().or(z.literal('').transform(() => undefined));

// Create / update share the same writable fields — name, privacy, password.
// `password` is not part of `roomSchema` (server hides it), so merge it in.
const writableFields = roomSchema.pick({ name: true, isPrivate: true }).extend({
  password: passwordSchema
});

// Private rooms must carry a password. For update, `isPrivate === undefined`
// means "leave as is" — boolean comparator below skips the check.
const requirePasswordWhenPrivate = (data: { isPrivate?: boolean; password?: string }) =>
  data.isPrivate !== true || (!!data.password && data.password.length >= 4);

export const createRoomInputSchema = writableFields.refine(requirePasswordWhenPrivate, {
  message: 'Password required for private rooms',
  path: ['password']
});

export const updateRoomInputSchema = writableFields
  .partial()
  .refine(
    (data) =>
      data.name !== undefined || data.isPrivate !== undefined || data.password !== undefined,
    { message: 'At least one field required' }
  )
  .refine(requirePasswordWhenPrivate, {
    message: 'Password required when switching to private',
    path: ['password']
  });

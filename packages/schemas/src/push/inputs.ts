import { z } from 'zod';

export const pushPlatformSchema = z.enum(['android', 'ios']);

export const registerPushDeviceInputSchema = z.object({
  token: z.string().min(1).max(4096),
  platform: pushPlatformSchema,
  locale: z.string().min(2).max(16).optional()
});

export const unregisterPushDeviceInputSchema = z.object({
  token: z.string().min(1).max(4096)
});

import { z } from 'zod';

const LOCAL_APP_URL = 'http://localhost:3000';
const LOCAL_API_URL = 'http://localhost:4000';

const schema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().default(''),
  NEXT_PUBLIC_API_URL: z.string().default(''),
  API_INTERNAL_URL: z.string().default(''),
  NEXT_PUBLIC_APP_VERSION: z.string().min(1).default('0.0.0')
});

const parsed = schema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  API_INTERNAL_URL: process.env.API_INTERNAL_URL,
  NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION
});

export const env = {
  appUrl: parsed.NEXT_PUBLIC_APP_URL || LOCAL_APP_URL,
  apiUrl: parsed.API_INTERNAL_URL || parsed.NEXT_PUBLIC_API_URL || LOCAL_API_URL,
  appVersion: parsed.NEXT_PUBLIC_APP_VERSION
};

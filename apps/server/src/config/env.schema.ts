import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),

  DATABASE_URL: z.url(),
  DIRECT_URL: z.url().optional(),

  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.url(),
  AUTH_DEV_ALLOWED_HOSTS: z.string().optional(),

  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().default(465),
  // true = implicit TLS (port 465); false = STARTTLS (port 587).
  SMTP_SECURE: z
    .enum(['true', 'false'])
    .default('true')
    .transform((value) => value === 'true'),
  SMTP_USER: z.string().min(1),
  SMTP_PASSWORD: z.string().min(1),
  EMAIL_FROM: z.string().min(1),

  // Address that receives user bug reports / feedback ("Report a problem").
  SUPPORT_EMAIL: z.email(),

  // Dev-only: redirect every outgoing email to this address. Lets you test
  // without spamming real users. Ignored in production.
  DEV_EMAIL_OVERRIDE: z.email().optional(),

  LIVEKIT_API_KEY: z.string().min(1),
  LIVEKIT_API_SECRET: z.string().min(1),
  LIVEKIT_URL: z.url(),

  // Optional Telegram bot for voice-join notifications. Leave both unset to
  // disable — the notifier becomes a no-op and nothing else is affected.
  TELEGRAM_BOT_TOKEN: z.string().min(1).optional(),
  TELEGRAM_CHAT_ID: z.string().min(1).optional(),

  // Optional outbound proxy for reaching api.telegram.org. Needed on hosts where
  // the Bot API is network-blocked (e.g. RU datacenters). Accepts an http(s) or
  // socks5 URL, e.g. socks5://127.0.0.1:1080 or http://user:pass@host:3128.
  // Unset = direct connection.
  TELEGRAM_PROXY_URL: z.string().min(1).optional(),

  // Optional http(s) proxy for outbound fetches made on behalf of users: link
  // previews and allow-listed remote images. Same purpose as TELEGRAM_PROXY_URL,
  // for sites blocked from the server (e.g. YouTube from RU). The target is still
  // resolved and checked here, and the proxy is handed the vetted IP, so it cannot
  // be used to reach private networks. Unset = direct connection.
  OUTBOUND_PROXY_URL: z.url().optional(),

  // Optional Firebase service account JSON (stringified) for FCM push on mobile.
  // Leave unset to disable push — register/unregister endpoints still work but
  // no notifications are sent.
  FIREBASE_SERVICE_ACCOUNT: z.string().min(1).optional(),

  // Public origin where uploaded files are served from (e.g. https://api.chatovo.ru).
  // Used to build absolute URLs stored in the DB and returned to clients.
  PUBLIC_FILES_URL: z.url().default('http://localhost:4000'),

  // Filesystem directory where uploaded files (avatars, chat attachments) are
  // written. Served back under /uploads. In Docker this is a mounted volume.
  UPLOADS_DIR: z.string().default('./uploads'),

  // Directory for resized images produced by GET /images. Disposable: anything
  // missing is regenerated from the source. In Docker this is a mounted volume.
  IMAGE_CACHE_DIR: z.string().default('./.image-cache'),

  // The public website. Room link previews take their Open Graph image from it.
  SITE_URL: z.url().default('https://chatovo.ru'),

  // Comma-separated list of allowed CORS origins (web client domains).
  // Tauri origins are always allowed and don't need to be listed here.
  CORS_ORIGINS: z.string().default('http://localhost:3000')
});

export type Env = z.infer<typeof envSchema>;

export const validateEnv = (raw: Record<string, unknown>): Env => {
  const parsed = envSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(`Invalid environment:\n${z.prettifyError(parsed.error)}`);
  }

  return parsed.data;
};

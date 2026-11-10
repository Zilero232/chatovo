export const OUTBOUND = {
  userAgent: 'Mozilla/5.0 (compatible; ChatovoBot/1.0; +https://chatovo.ru) (like TwitterBot)',
  acceptLanguage: 'ru,en;q=0.8',
  timeoutMs: 6000,
  attemptTimeoutMs: 2500,
  maxRedirects: 4,
  allowedPorts: new Set(['', '80', '443'])
} as const;

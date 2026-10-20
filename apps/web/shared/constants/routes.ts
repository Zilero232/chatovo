import { APP_SCHEME } from './scheme';

const AUTH_PATH = '/auth';

export const ROUTES = {
  lobby: '/lobby',
  auth: AUTH_PATH,
  resetPassword: `${AUTH_PATH}/reset-password`,
  room: '/room',
  admin: '/admin',
  accountDelete: '/account/delete'
} as const;

export const PUBLIC_ROUTES = [ROUTES.auth, ROUTES.resetPassword] as const;

/**
 * Reachable with or without a session, and never redirected either way.
 * Google Play requires the account deletion page to open for a signed-out
 * visitor, while the people who actually use it are signed in.
 */
export const OPEN_ROUTES = [ROUTES.accountDelete] as const;

export const DEEP_LINKS = {
  auth: `${APP_SCHEME}://auth`
} as const;

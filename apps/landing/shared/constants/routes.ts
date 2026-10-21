import { SITE_PATHS } from '@chatovo/config';

export const ROUTES = SITE_PATHS;

export const APP_ROUTES = {
  lobby: '/lobby',
  auth: '/auth',
  room: '/room',
  admin: '/admin',
  accountDelete: '/account/delete'
} as const;

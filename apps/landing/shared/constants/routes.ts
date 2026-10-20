import { SITE_EN_PREFIX, SITE_PATHS } from '@chatovo/config';

export const EN_PREFIX = SITE_EN_PREFIX;

export const ROUTES = {
  ...SITE_PATHS,
  homeEn: EN_PREFIX
} as const;

export const APP_ROUTES = {
  lobby: '/lobby',
  auth: '/auth',
  room: '/room',
  admin: '/admin',
  accountDelete: '/account/delete'
} as const;

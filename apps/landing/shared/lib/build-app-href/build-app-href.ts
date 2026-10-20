import { env } from '@/shared/config';
import { APP_ROUTES } from '@/shared/constants';

/** Absolute link into the app host; the lobby is its front page, so it is the bare origin. */
export const buildAppHref = (path: string): string =>
  path === APP_ROUTES.lobby ? env.appUrl : `${env.appUrl}${path}`;

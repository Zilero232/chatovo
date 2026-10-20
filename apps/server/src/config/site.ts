import { env } from '../core';

/** Origin of the public website, which serves the shared Open Graph image. */
export const siteBaseURL = env.SITE_URL.replace(/\/$/, '');

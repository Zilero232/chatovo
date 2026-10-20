export const SITE_EN_PREFIX = '/en';

export const SITE_PATHS = {
  home: '/',
  features: '/features',
  download: '/download',
  changelog: '/changelog',
  about: '/about',
  support: '/support',
  privacy: '/privacy',
  terms: '/terms'
} as const;

export type SitePath = (typeof SITE_PATHS)[keyof typeof SITE_PATHS];

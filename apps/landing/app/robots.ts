import type { MetadataRoute } from 'next';

import { SITE } from '@/shared/config';
import { APP_ROUTES } from '@/shared/constants';

const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: '*',
    allow: '/',
    disallow: Object.values(APP_ROUTES)
  },
  sitemap: `${SITE.url}/sitemap.xml`,
  host: SITE.url
});

export default robots;

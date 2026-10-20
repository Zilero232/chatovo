import { SITE } from '@/shared/config';
import { ROUTES } from '@/shared/constants';

const url = (path: string) => new URL(path, SITE.url).toString();

export const siteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      description: SITE.description,
      inLanguage: SITE.lang,
      publisher: { '@id': `${SITE.url}/#author` }
    },
    {
      '@type': 'Person',
      '@id': `${SITE.url}/#author`,
      name: 'Alexandr Artemev',
      url: SITE.url
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${SITE.url}/#app`,
      name: SITE.name,
      url: SITE.url,
      description: SITE.description,
      applicationCategory: 'CommunicationApplication',
      applicationSubCategory: 'Voice and video conferencing',
      operatingSystem: 'Web, Windows, macOS, Linux, Android',
      browserRequirements: 'Requires a browser with WebRTC support',
      softwareHelp: url(ROUTES.support),
      downloadUrl: url(ROUTES.download),
      releaseNotes: url(ROUTES.changelog),
      isAccessibleForFree: true,
      inLanguage: [SITE.lang, SITE.en.lang],
      author: { '@id': `${SITE.url}/#author` },
      creator: { '@id': `${SITE.url}/#author` },
      publisher: { '@id': `${SITE.url}/#author` },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock'
      },
      featureList: [
        'Real-time voice rooms',
        'Real-time video rooms',
        'Screen sharing',
        'Text chat with file attachments',
        'Password-protected private rooms',
        'Friends list with direct voice calls',
        'Global shortcuts and push-to-talk on desktop',
        'Email sign-in',
        'Native desktop app for Windows, macOS and Linux',
        'Android app',
        'Self-hostable source-available project'
      ]
    }
  ]
} as const;

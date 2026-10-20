import type { Metadata, Viewport } from 'next';

import { SITE } from '@/shared/config';

export const appMetadata: Metadata = {
  metadataBase: new URL(SITE.appUrl),
  title: {
    default: SITE.name,
    template: `%s · ${SITE.name}`
  },
  description: SITE.description,
  applicationName: SITE.name,
  icons: {
    icon: [
      { url: '/brand/favicon.svg', type: 'image/svg+xml' },
      { url: '/brand/app-icon-1024.png', type: 'image/png', sizes: '1024x1024' }
    ],
    shortcut: '/brand/favicon.svg',
    apple: [{ url: '/brand/app-icon-1024.png', sizes: '1024x1024', type: 'image/png' }]
  },
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    images: [new URL('/opengraph-image', SITE.url).toString()]
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.title,
    description: SITE.description,
    images: [new URL('/opengraph-image', SITE.url).toString()]
  },
  robots: { index: false, follow: false }
};

export const appViewport: Viewport = {
  themeColor: SITE.themeColor.dark,
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover'
};

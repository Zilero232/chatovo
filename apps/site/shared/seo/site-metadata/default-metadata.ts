import type { Metadata, Viewport } from 'next';

import { SITE } from '@/shared/config';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s · ${SITE.name}`
  },
  description: SITE.description,
  applicationName: SITE.name,
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  keywords: [...SITE.keywords],
  authors: [{ name: 'Alexandr Artemev', url: SITE.url }],
  creator: 'Alexandr Artemev',
  publisher: 'Alexandr Artemev',
  category: 'communication',
  formatDetection: { email: false, address: false, telephone: false },
  icons: {
    icon: [
      { url: '/brand/favicon.svg', type: 'image/svg+xml' },
      { url: '/brand/app-icon-1024.png', type: 'image/png', sizes: '1024x1024' }
    ],
    shortcut: '/brand/favicon.svg',
    apple: [{ url: '/brand/app-icon-1024.png', sizes: '1024x1024', type: 'image/png' }]
  },
  alternates: {
    canonical: '/',
    languages: { 'en-US': '/', 'x-default': '/' }
  },
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.title,
    description: SITE.description,
    creator: SITE.social.twitter,
    site: SITE.social.twitter
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};

export const defaultViewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: SITE.themeColor.light },
    { media: '(prefers-color-scheme: dark)', color: SITE.themeColor.dark }
  ],
  colorScheme: 'dark light',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover'
};

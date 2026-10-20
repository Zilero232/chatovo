import type { HtmlTagDescriptor } from 'vite';

import { SITE } from '@chatovo/config';

const OG_IMAGE = new URL('/opengraph-image', SITE.url).toString();

const meta = (attrs: Record<string, string>): HtmlTagDescriptor => ({
  tag: 'meta',
  attrs,
  injectTo: 'head'
});

const link = (attrs: Record<string, string>): HtmlTagDescriptor => ({
  tag: 'link',
  attrs,
  injectTo: 'head'
});

/** The app's static `<head>`: description, noindex, icons and the social card, injected by `vite.config.ts`. */
export const APP_HEAD_TAGS: HtmlTagDescriptor[] = [
  meta({ name: 'description', content: SITE.description }),
  meta({ name: 'application-name', content: SITE.name }),
  meta({ name: 'robots', content: 'noindex, nofollow' }),
  meta({ name: 'theme-color', content: SITE.themeColor.dark }),
  meta({ name: 'color-scheme', content: 'dark' }),
  link({ rel: 'icon', href: '/icon.svg', type: 'image/svg+xml', sizes: 'any' }),
  link({ rel: 'icon', href: '/icon.png', type: 'image/png', sizes: '512x512' }),
  link({ rel: 'icon', href: '/brand/favicon.svg', type: 'image/svg+xml' }),
  link({ rel: 'icon', href: '/brand/app-icon-1024.png', type: 'image/png', sizes: '1024x1024' }),
  link({ rel: 'shortcut icon', href: '/brand/favicon.svg' }),
  link({ rel: 'apple-touch-icon', href: '/apple-icon.png', sizes: '180x180', type: 'image/png' }),
  link({
    rel: 'apple-touch-icon',
    href: '/brand/app-icon-1024.png',
    sizes: '1024x1024',
    type: 'image/png'
  }),
  meta({ property: 'og:type', content: 'website' }),
  meta({ property: 'og:locale', content: SITE.locale }),
  meta({ property: 'og:site_name', content: SITE.name }),
  meta({ property: 'og:title', content: SITE.title }),
  meta({ property: 'og:description', content: SITE.description }),
  meta({ property: 'og:image', content: OG_IMAGE }),
  meta({ name: 'twitter:card', content: 'summary_large_image' }),
  meta({ name: 'twitter:title', content: SITE.title }),
  meta({ name: 'twitter:description', content: SITE.description }),
  meta({ name: 'twitter:image', content: OG_IMAGE })
];

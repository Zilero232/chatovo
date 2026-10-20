import type { ReactNode } from 'react';

import { clsx } from 'clsx';
import { JetBrains_Mono, Lora, Manrope } from 'next/font/google';

import { SITE } from '@/shared/config';
import { getTauriMobileHmrShim } from '@/shared/lib/tauri-mobile-hmr-shim';

import 'modern-normalize/modern-normalize.css';
import './globals.scss';

export { appMetadata as metadata, appViewport as viewport } from '@/shared/seo';

const sans = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap'
});

const serif = Lora({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-serif',
  style: ['normal', 'italic'],
  display: 'swap',
  adjustFontFallback: true
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap'
});

const tauriMobileHmrShim = getTauriMobileHmrShim();

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html
    suppressHydrationWarning
    className={clsx('dark', sans.variable, serif.variable, mono.variable)}
    lang={SITE.lang}
  >
    <head>
      {tauriMobileHmrShim ? (
        <script
          suppressHydrationWarning
          // eslint-disable-next-line react/dom-no-dangerously-set-innerhtml -- dev-only inline HMR shim for Tauri Android WebView
          dangerouslySetInnerHTML={{ __html: tauriMobileHmrShim }}
        />
      ) : null}
    </head>
    <body className='font-sans'>{children}</body>
  </html>
);

export default RootLayout;

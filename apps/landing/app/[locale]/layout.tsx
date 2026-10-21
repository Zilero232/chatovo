import type { ReactNode } from 'react';

import { clsx } from 'clsx';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { JetBrains_Mono, Lora, Manrope } from 'next/font/google';
import { notFound } from 'next/navigation';

import { isLocale, LOCALES, messages } from '@/shared/i18n';
import { SiteJsonLd } from '@/shared/seo';

import 'modern-normalize/modern-normalize.css';
import '../globals.scss';

export { defaultMetadata as metadata, defaultViewport as viewport } from '@/shared/seo';

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

export const generateStaticParams = () => LOCALES.map((locale) => ({ locale }));

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

const LocaleLayout = async ({ children, params }: LocaleLayoutProps) => {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html className={clsx('dark', sans.variable, serif.variable, mono.variable)} lang={locale}>
      <head>
        <SiteJsonLd />
      </head>
      <body className='font-sans'>
        <NextIntlClientProvider messages={{ ui: messages[locale].ui }}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default LocaleLayout;

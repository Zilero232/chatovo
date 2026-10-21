import type { Metadata } from 'next';

import { localizeSitePath } from '@chatovo/config';
import { getTranslations } from 'next-intl/server';

import type { Locale } from '@/shared/i18n';

import { SITE } from '@/shared/config';
import { LOCALES, OPEN_GRAPH_LOCALES } from '@/shared/i18n';

import type { MarketingMetadataInput } from './marketing-metadata.types';

const KEYWORDS: Partial<Record<Locale, readonly string[]>> = {
  ru: SITE.keywords,
  en: SITE.en.keywords
};

export const createMarketingMetadata = async ({
  locale,
  namespace,
  path
}: MarketingMetadataInput): Promise<Metadata> => {
  const t = await getTranslations({ locale, namespace });

  const title = t('title');
  const description = t('description');
  const isHome = namespace === 'home.meta';
  const ogTitle = isHome ? title : `${title} · ${SITE.name}`;
  const canonical = localizeSitePath({ path, locale });
  const keywords = KEYWORDS[locale];

  return {
    title: isHome ? { absolute: title } : title,
    description,
    keywords: keywords ? [...keywords] : undefined,
    alternates: {
      canonical,
      languages: {
        ...Object.fromEntries(
          LOCALES.map((code) => [code, localizeSitePath({ path, locale: code })])
        ),
        'x-default': path
      }
    },
    robots: { index: true, follow: true },
    openGraph: {
      title: ogTitle,
      description,
      url: canonical,
      type: 'website',
      siteName: SITE.name,
      locale: OPEN_GRAPH_LOCALES[locale],
      alternateLocale: LOCALES.filter((code) => code !== locale).map(
        (code) => OPEN_GRAPH_LOCALES[code]
      )
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description
    }
  };
};

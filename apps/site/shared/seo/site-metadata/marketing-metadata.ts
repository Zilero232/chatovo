import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';

import type { Locale } from '@/shared/i18n';

import { SITE } from '@/shared/config';
import { localizeMarketingPath } from '@/shared/lib';

import type {
  MarketingMetadataInput,
  TranslatedMarketingNamespace
} from './marketing-metadata.types';

type Copy = {
  title: string;
  description: string;
  keywords?: string[];
};

const homeCopy = (locale: Locale): Copy => {
  const site = locale === 'en' ? SITE.en : SITE;

  return {
    title: site.title,
    description: site.description,
    keywords: [...site.keywords]
  };
};

const translatedCopy = async ({
  locale,
  namespace
}: {
  locale: Locale;
  namespace: TranslatedMarketingNamespace;
}): Promise<Copy> => {
  const t = await getTranslations({ locale, namespace: `${namespace}.meta` });

  return {
    title: t('title'),
    description: t('description')
  };
};

/**
 * Builds page metadata from the page's own `meta` translations, so the Russian
 * page ships Russian title and description and the English one ships English,
 * with both pointing at each other through hreflang alternates. The home page
 * takes its copy from `SITE` instead, since it carries keywords too.
 */
export const createMarketingMetadata = async ({
  locale,
  namespace,
  path
}: MarketingMetadataInput): Promise<Metadata> => {
  const { title, description, keywords } =
    namespace === 'home' ? homeCopy(locale) : await translatedCopy({ locale, namespace });

  const ogTitle = namespace === 'home' ? title : `${title} · ${SITE.name}`;

  const canonical = localizeMarketingPath({ path, locale });

  return {
    title: namespace === 'home' ? { absolute: title } : title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: {
        ru: path,
        en: localizeMarketingPath({ path, locale: 'en' }),
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
      locale: locale === 'en' ? SITE.en.locale : SITE.locale,
      alternateLocale: [locale === 'en' ? SITE.locale : SITE.en.locale]
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description
    }
  };
};

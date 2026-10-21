import type { MetadataRoute } from 'next';

import { localizeSitePath } from '@chatovo/config';

import { SITE } from '@/shared/config';
import { ROUTES } from '@/shared/constants';
import { DEFAULT_LOCALE, LOCALES } from '@/shared/i18n';

export const dynamic = 'force-static';

const url = (path: string) => new URL(path, SITE.url).toString();

type LocalizedEntry = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
};

const LOCALIZED_ENTRIES: LocalizedEntry[] = [
  { path: ROUTES.home, changeFrequency: 'weekly', priority: 1 },
  { path: ROUTES.features, changeFrequency: 'monthly', priority: 0.8 },
  { path: ROUTES.download, changeFrequency: 'weekly', priority: 0.8 },
  { path: ROUTES.changelog, changeFrequency: 'weekly', priority: 0.7 },
  { path: ROUTES.about, changeFrequency: 'monthly', priority: 0.5 },
  { path: ROUTES.support, changeFrequency: 'monthly', priority: 0.5 },
  { path: ROUTES.privacy, changeFrequency: 'yearly', priority: 0.3 },
  { path: ROUTES.terms, changeFrequency: 'yearly', priority: 0.3 }
];

const TRANSLATION_PRIORITY_FACTOR = 0.9;

const toLocalizedEntries = ({
  path,
  changeFrequency,
  priority
}: LocalizedEntry): MetadataRoute.Sitemap => {
  const languages = Object.fromEntries(
    LOCALES.map((locale) => [locale, url(localizeSitePath({ path, locale }))])
  );

  const alternates = { languages: { ...languages, 'x-default': url(path) } };

  return LOCALES.map((locale) => ({
    url: languages[locale],
    changeFrequency,
    priority:
      locale === DEFAULT_LOCALE
        ? priority
        : Number((priority * TRANSLATION_PRIORITY_FACTOR).toFixed(2)),
    alternates
  }));
};

const sitemap = (): MetadataRoute.Sitemap => LOCALIZED_ENTRIES.flatMap(toLocalizedEntries);

export default sitemap;

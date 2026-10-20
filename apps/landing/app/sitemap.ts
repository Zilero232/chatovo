import type { MetadataRoute } from 'next';

import { SITE } from '@/shared/config';
import { ROUTES } from '@/shared/constants';
import { localizeMarketingPath } from '@/shared/lib';

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
  { path: ROUTES.support, changeFrequency: 'monthly', priority: 0.5 }
];

const LEGAL_ENTRIES: MetadataRoute.Sitemap = [
  { url: url(ROUTES.privacy), changeFrequency: 'yearly', priority: 0.3 },
  { url: url(ROUTES.terms), changeFrequency: 'yearly', priority: 0.3 }
];

const EN_PRIORITY_FACTOR = 0.9;

const toLocalizedPair = ({
  path,
  changeFrequency,
  priority
}: LocalizedEntry): MetadataRoute.Sitemap => {
  const enPath = localizeMarketingPath({ path, locale: 'en' });

  const alternates = {
    languages: {
      ru: url(path),
      en: url(enPath),
      'x-default': url(path)
    }
  };

  return [
    { url: url(path), changeFrequency, priority, alternates },
    {
      url: url(enPath),
      changeFrequency,
      priority: Number((priority * EN_PRIORITY_FACTOR).toFixed(2)),
      alternates
    }
  ];
};

const sitemap = (): MetadataRoute.Sitemap => [
  ...LOCALIZED_ENTRIES.flatMap(toLocalizedPair),
  ...LEGAL_ENTRIES
];

export default sitemap;

import { getTranslations } from 'next-intl/server';

import { MarketingIconGrid } from '@/widgets/marketing/marketing-shell';

import type { DownloadPageProps } from '../../DownloadPage.types';

import { DOWNLOAD_REQUIREMENT_ICONS, DOWNLOAD_REQUIREMENT_KEYS } from '../../../config';

export const DownloadRequirements = async ({ locale }: DownloadPageProps) => {
  const t = await getTranslations({ locale, namespace: 'download.requirements' });

  const items = DOWNLOAD_REQUIREMENT_KEYS.map((key) => ({
    key,
    Icon: DOWNLOAD_REQUIREMENT_ICONS[key],
    title: t(`items.${key}.title`),
    description: t(`items.${key}.description`)
  }));

  return (
    <MarketingIconGrid
      columns={4}
      description={t('description')}
      heading={t('heading')}
      items={items}
    />
  );
};

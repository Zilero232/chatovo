import { getTranslations } from 'next-intl/server';

import { MarketingCtaPanel } from '@/widgets/marketing/marketing-shell';

import type { HomePageProps } from '../../HomePage.types';

export const HomeFinalCta = async ({ locale }: HomePageProps) => {
  const t = await getTranslations({ locale, namespace: 'home.finalCta' });

  return (
    <MarketingCtaPanel
      actionLabel={t('action')}
      description={t('description')}
      heading={t('heading')}
      note={t('note')}
    />
  );
};

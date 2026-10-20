import { getTranslations } from 'next-intl/server';

import { MarketingIconGrid } from '@/widgets/marketing/marketing-shell';

import type { AboutPageProps } from '../../AboutPage.types';

import { ABOUT_STACK_ICONS, ABOUT_STACK_KEYS } from '../../../config';

export const AboutStack = async ({ locale }: AboutPageProps) => {
  const t = await getTranslations({ locale, namespace: 'about.stack' });

  const items = ABOUT_STACK_KEYS.map((key) => ({
    key,
    Icon: ABOUT_STACK_ICONS[key],
    title: t(`items.${key}.title`),
    description: t(`items.${key}.description`)
  }));

  return (
    <MarketingIconGrid
      description={t('subheading')}
      heading={t('heading')}
      id='stack'
      items={items}
    />
  );
};

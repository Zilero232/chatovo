import { getTranslations } from 'next-intl/server';

import { MarketingIconGrid } from '@/widgets/marketing/marketing-shell';

import type { AboutPageProps } from '../../AboutPage.types';

import { ABOUT_STORY_ICONS, ABOUT_STORY_KEYS } from '../../../config';

export const AboutStory = async ({ locale }: AboutPageProps) => {
  const t = await getTranslations({ locale, namespace: 'about.story' });

  const items = ABOUT_STORY_KEYS.map((key) => ({
    key,
    Icon: ABOUT_STORY_ICONS[key],
    title: t(`items.${key}.title`),
    description: t(`items.${key}.description`)
  }));

  return (
    <MarketingIconGrid
      delayStep={0.06}
      description={t('subheading')}
      heading={t('heading')}
      id='story'
      items={items}
    />
  );
};

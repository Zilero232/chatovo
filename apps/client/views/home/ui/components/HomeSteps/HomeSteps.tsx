import { getTranslations } from 'next-intl/server';

import { RevealOnScroll, Text } from '@/ui-kit';
import { MarketingSection, MarketingSectionHead } from '@/widgets/marketing/marketing-shell';

import type { HomePageProps } from '../../HomePage.types';

import { HOME_STEP_KEYS } from '../../../config';
import { HomeStepFragment } from '../HomeStepFragment/HomeStepFragment';

import s from '../../HomePage.module.scss';

export const HomeSteps = async ({ locale }: HomePageProps) => {
  const t = await getTranslations({ locale, namespace: 'home.steps' });

  const fragmentLabels = {
    create: t('items.create.fragment'),
    talk: t('items.talk.fragment')
  };

  return (
    <MarketingSection id='how-it-works'>
      <MarketingSectionHead description={t('subheading')} heading={t('heading')} />

      <ol className={s.steps}>
        {HOME_STEP_KEYS.map((key, index) => (
          <RevealOnScroll key={key} as='li' className={s.step} delay={index * 0.08}>
            <span aria-hidden className={s.stepIndex}>
              {index + 1}
            </span>
            <Text as='h3' className={s.stepTitle} weight='semibold'>
              {t(`items.${key}.title`)}
            </Text>
            <Text size='sm' tone='muted'>
              {t(`items.${key}.description`)}
            </Text>
            <HomeStepFragment labels={fragmentLabels} step={key} />
          </RevealOnScroll>
        ))}
      </ol>
    </MarketingSection>
  );
};

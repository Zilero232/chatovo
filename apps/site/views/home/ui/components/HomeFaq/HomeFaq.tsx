import { RevealOnScroll, Text } from '@chatovo/ui-kit';
import { ChevronDown } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { MarketingSection, MarketingSectionHead } from '@/widgets/marketing/marketing-shell';

import type { HomePageProps } from '../../HomePage.types';

import { HOME_FAQ_KEYS } from '../../../config';

import s from '../../HomePage.module.scss';

export const HomeFaq = async ({ locale }: HomePageProps) => {
  const t = await getTranslations({ locale, namespace: 'home.faq' });

  return (
    <MarketingSection id='faq'>
      <div className={s.faq}>
        <MarketingSectionHead description={t('subheading')} heading={t('heading')} />

        <RevealOnScroll className={s.faqList}>
          {HOME_FAQ_KEYS.map((key) => (
            <details key={key} className={s.faqItem}>
              <summary className={s.faqQuestion}>
                {t(`items.${key}.question`)}
                <ChevronDown aria-hidden className={s.faqChevron} />
              </summary>
              <Text className={s.faqAnswer} size='base' tone='muted'>
                {t(`items.${key}.answer`)}
              </Text>
            </details>
          ))}
        </RevealOnScroll>
      </div>
    </MarketingSection>
  );
};

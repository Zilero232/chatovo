import { Chato, RevealOnScroll, Text } from '@chatovo/ui-kit';
import { getTranslations } from 'next-intl/server';

import { MarketingAppCta, MarketingSection } from '@/widgets/marketing/marketing-shell';

import type { HomePageProps } from '../../HomePage.types';

import s from '../../HomePage.module.scss';

export const HomeFinalCta = async ({ locale }: HomePageProps) => {
  const t = await getTranslations({ locale, namespace: 'home.finalCta' });

  return (
    <MarketingSection>
      <RevealOnScroll className={s.finalCta}>
        <Chato className={s.finalCtaChato} pose='wave' />

        <div className={s.finalCtaCopy}>
          <h2 className={s.finalCtaHeading}>{t('heading')}</h2>

          <Text size='base' tone='muted'>
            {t('description')}
          </Text>

          <div className={s.finalCtaActions}>
            <MarketingAppCta label={t('action')} size='lg' />
            <Text size='sm' tone='subtle'>
              {t('note')}
            </Text>
          </div>
        </div>
      </RevealOnScroll>
    </MarketingSection>
  );
};

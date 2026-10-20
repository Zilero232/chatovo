import { Chato, RevealOnScroll } from '@chatovo/ui-kit';
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

          <p className={s.finalCtaText}>{t('description')}</p>

          <div className={s.finalCtaActions}>
            <MarketingAppCta className={s.finalCtaButton} label={t('action')} size='lg' />
            <span className={s.finalCtaNote}>{t('note')}</span>
          </div>
        </div>
      </RevealOnScroll>
    </MarketingSection>
  );
};

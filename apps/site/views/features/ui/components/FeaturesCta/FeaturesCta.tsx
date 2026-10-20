import { Button, RevealOnScroll, Text } from '@chatovo/ui-kit';
import { getTranslations } from 'next-intl/server';

import { ROUTES } from '@/shared/constants';
import { MarketingAppCta, MarketingSection } from '@/widgets/marketing/marketing-shell';

import type { FeaturesCtaProps } from './FeaturesCta.types';

import s from '../../FeaturesPage.module.scss';

export const FeaturesCta = async ({ locale }: FeaturesCtaProps) => {
  const t = await getTranslations({ locale, namespace: 'features.cta' });

  return (
    <MarketingSection>
      <RevealOnScroll className={s.cta}>
        <Text as='h2' className={s.ctaHeading} weight='bold'>
          {t('heading')}
        </Text>

        <Text className={s.ctaDescription} size='base' tone='muted'>
          {t('description')}
        </Text>

        <div className={s.ctaActions}>
          <MarketingAppCta label={t('signIn')} size='lg' />

          <Button href={ROUTES.download} size='lg' variant='outline'>
            {t('download')}
          </Button>
        </div>
      </RevealOnScroll>
    </MarketingSection>
  );
};
